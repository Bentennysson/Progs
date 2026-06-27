// Browser calculator with expression parsing and complex number support

function renderMessage(msg) {
  const out = document.getElementById('output');
  out.textContent = msg;
}

// Complex number helper
class Complex {
  constructor(re, im) {
    this.re = Number(re) || 0;
    this.im = Number(im) || 0;
  }
  static from(x) {
    if (x instanceof Complex) return x;
    return new Complex(x, 0);
  }
  add(b) { b = Complex.from(b); return new Complex(this.re + b.re, this.im + b.im); }
  sub(b) { b = Complex.from(b); return new Complex(this.re - b.re, this.im - b.im); }
  mul(b) { b = Complex.from(b); return new Complex(this.re * b.re - this.im * b.im, this.re * b.im + this.im * b.re); }
  div(b) { b = Complex.from(b); const denom = b.re*b.re + b.im*b.im; return new Complex((this.re*b.re + this.im*b.im)/denom, (this.im*b.re - this.re*b.im)/denom); }
  neg() { return new Complex(-this.re, -this.im); }
  abs() { return Math.hypot(this.re, this.im); }
  arg() { return Math.atan2(this.im, this.re); }
  conj() { return new Complex(this.re, -this.im); }
  exp() { const e = Math.exp(this.re); return new Complex(e * Math.cos(this.im), e * Math.sin(this.im)); }
  log() { return new Complex(Math.log(this.abs()), this.arg()); }
  pow(b) { b = Complex.from(b); // z^w = exp(w * log z)
    return this.log().mul(b).exp();
  }
  sin() { // sin(x+iy)=sin x cosh y + i cos x sinh y
    return new Complex(Math.sin(this.re) * Math.cosh(this.im), Math.cos(this.re) * Math.sinh(this.im));
  }
  cos() { // cos(x+iy)=cos x cosh y - i sin x sinh y
    return new Complex(Math.cos(this.re) * Math.cosh(this.im), -Math.sin(this.re) * Math.sinh(this.im));
  }
  tan() { return this.sin().div(this.cos()); }
  asin() { // asin z = -i log( i z + sqrt(1 - z^2) )
    const i = new Complex(0,1);
    const one = new Complex(1,0);
    const sqrt = one.sub(this.mul(this)).sqrt();
    const val = i.mul(this).add(sqrt).log().mul(new Complex(0,-1));
    return val;
  }
  acos() { // acos z = -i log( z + i sqrt(1 - z^2) )
    const i = new Complex(0,1);
    const one = new Complex(1,0);
    const sqrt = one.sub(this.mul(this)).sqrt();
    const val = this.add(i.mul(sqrt)).log().mul(new Complex(0,-1));
    return val;
  }
  atan() { // atan z = (i/2) log((1 - i z)/(1 + i z))
    const i = new Complex(0,1);
    const one = new Complex(1,0);
    const num = one.sub(i.mul(this));
    const den = one.add(i.mul(this));
    return num.div(den).log().mul(new Complex(0,-0.5));
  }
  // Additional helper: sqrt (principal)
  sqrt() {
    const r = this.abs();
    const re = Math.sqrt((r + this.re) / 2);
    const im = Math.sign(this.im) * Math.sqrt((r - this.re) / 2 || 0);
    return new Complex(re, im);
  }
  toString() {
    const r = Number(this.re.toFixed(10));
    const i = Number(this.im.toFixed(10));
    if (Math.abs(i) < 1e-12) return String(r);
    if (Math.abs(r) < 1e-12) return (i === 1 ? 'i' : i === -1 ? '-i' : i + 'i');
    return `${r}${i >= 0 ? '+' : ''}${i}i`;
  }
}

// Evaluate expression (using shunting-yard -> RPN) supporting complex literals like 3i or i
function evaluateExpression(expression) {
  if (typeof expression !== 'string') throw new TypeError('Expression must be a string');
  const expr = expression.trim();
  if (expr.length === 0) throw new Error('Empty expression');

  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  const result = evaluateRPN(rpn);
  if (result instanceof Complex) return result.toString();
  return String(result);
}

function getAngleMode() {
  if (typeof document === 'undefined') return 'rad';
  const el = document.getElementById('angle-mode');
  return el ? el.value : 'rad';
}

function degToRad(x) { return x * Math.PI / 180; }
function radToDeg(x) { return x * 180 / Math.PI; }

// Tokenizer: numbers, complex literals (3i), identifiers, operators, parentheses, commas
function tokenize(s) {
  const tokens = [];
  const re = /\s*([0-9]*\.?[0-9]+i|[0-9]*\.?[0-9]+|i|[a-zA-Z_][a-zA-Z0-9_]*|\^|[+\-*/(),%])\s*/g;
  let m;
  let index = 0;
  while ((m = re.exec(s)) !== null) {
    tokens.push(m[1]);
    index = re.lastIndex;
  }
  if (index !== s.length) throw new Error('Invalid characters in expression');
  return tokens;
}

function isIdentifier(t) { return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t) && t !== 'i'; }
function isNumberToken(t) { return /^[0-9]*\.?[0-9]+$/.test(t); }
function isImagToken(t) { return /^[0-9]*\.?[0-9]+i$/.test(t) || t === 'i'; }
function isOperator(t) { return /^[+\-*/^%]$/.test(t) || t === 'u-'; }

// Shunting-yard
function toRPN(tokens) {
  const output = [];
  const ops = [];
  const funcArgCount = [];

  const precedence = { '+': 2, '-': 2, '*': 3, '/': 3, '%': 3, '^': 4 };
  const rightAssoc = { '^': true };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (isNumberToken(t)) {
      output.push({ type: 'number', value: Number(t) });
    } else if (isImagToken(t)) {
      const val = t === 'i' ? 1 : Number(t.slice(0, -1));
      output.push({ type: 'complex', value: new Complex(0, val) });
    } else if (isIdentifier(t)) {
      ops.push({ type: 'func', value: t.toLowerCase() });
      funcArgCount.push(0);
    } else if (t === ',') {
      while (ops.length && ops[ops.length - 1].value !== '(') output.push(ops.pop());
      if (!ops.length) throw new Error('Misplaced comma or parentheses');
      if (funcArgCount.length) funcArgCount[funcArgCount.length - 1]++;
    } else if (isOperator(t) || /^[+\-*/^%]$/.test(t)) {
      const isUnary = t === '-' && (i === 0 || tokens[i - 1] === '(' || /^[+\-*/^%,]$/.test(tokens[i - 1]));
      const opToken = isUnary ? 'u-' : t;
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (top.value === '(' || top.type === 'func') break;
        const topPrec = precedence[top.value];
        const curPrec = precedence[opToken];
        if ((rightAssoc[opToken] && curPrec < topPrec) || (!rightAssoc[opToken] && curPrec <= topPrec)) {
          output.push(ops.pop());
        } else break;
      }
      ops.push({ type: 'op', value: opToken });
    } else if (t === '(') {
      ops.push({ type: 'paren', value: '(' });
    } else if (t === ')') {
      while (ops.length && ops[ops.length - 1].value !== '(') output.push(ops.pop());
      if (!ops.length) throw new Error('Mismatched parentheses');
      ops.pop();
      if (ops.length && ops[ops.length - 1].type === 'func') {
        const fn = ops.pop();
        const argc = (funcArgCount.pop() || 0) + 1;
        output.push({ type: 'func', value: fn.value, argc });
      }
    } else {
      throw new Error('Unknown token: ' + t);
    }
  }

  while (ops.length) {
    const top = ops.pop();
    if (top.value === '(' || top.value === ')') throw new Error('Mismatched parentheses');
    output.push(top);
  }
  return output;
}

// Evaluate RPN
function evaluateRPN(rpn) {
  const stack = [];
  for (const token of rpn) {
    if (token.type === 'number') stack.push(token.value);
    else if (token.type === 'complex') stack.push(token.value);
    else if (token.type === 'op') {
      if (token.value === 'u-') {
        const a = stack.pop();
        stack.push(coerce(a).neg());
      } else {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(applyOperator(token.value, a, b));
      }
    } else if (token.type === 'func') {
      const fn = token.value;
      const argc = token.argc || 1;
      const args = [];
      for (let i = 0; i < argc; i++) args.unshift(stack.pop());
      stack.push(applyFunction(fn, args));
    } else {
      if (token.value && isOperator(token.value)) {
        if (token.value === 'u-') {
          const a = stack.pop();
          stack.push(coerce(a).neg());
        } else {
          const b = stack.pop();
          const a = stack.pop();
          stack.push(applyOperator(token.value, a, b));
        }
      } else throw new Error('Invalid RPN token');
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  const res = stack[0];
  if (res instanceof Complex) return res;
  return Number(res);
}

function coerce(v) { return (v instanceof Complex) ? v : new Complex(Number(v), 0); }

function applyOperator(op, a, b) {
  if (a instanceof Complex || b instanceof Complex) {
    a = coerce(a); b = coerce(b);
    switch (op) {
      case '+': return a.add(b);
      case '-': return a.sub(b);
      case '*': return a.mul(b);
      case '/': return a.div(b);
      case '%': return new Complex(a.re % b.re, 0);
      case '^': return a.pow(b);
      default: throw new Error('Unknown operator: ' + op);
    }
  } else {
    a = Number(a); b = Number(b);
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      case '%': return a % b;
      case '^': return Math.pow(a, b);
      default: throw new Error('Unknown operator: ' + op);
    }
  }
}

function applyFunction(name, args) {
  const lower = name.toLowerCase();
  const hasComplex = args.some(a => a instanceof Complex);
  if (hasComplex) args = args.map(coerce);
  const mode = getAngleMode();
  switch (lower) {
    case 'sin': {
      if (hasComplex) return args[0].sin();
      let v = Number(args[0]); if (mode === 'deg') v = degToRad(v); return Math.sin(v);
    }
    case 'cos': {
      if (hasComplex) return args[0].cos();
      let v = Number(args[0]); if (mode === 'deg') v = degToRad(v); return Math.cos(v);
    }
    case 'tan': {
      if (hasComplex) return args[0].tan();
      let v = Number(args[0]); if (mode === 'deg') v = degToRad(v); return Math.tan(v);
    }
    case 'asin': {
      if (hasComplex) return args[0].asin();
      let v = Math.asin(Number(args[0])); if (mode === 'deg') v = radToDeg(v); return v;
    }
    case 'acos': {
      if (hasComplex) return args[0].acos();
      let v = Math.acos(Number(args[0])); if (mode === 'deg') v = radToDeg(v); return v;
    }
    case 'atan': {
      if (hasComplex) return args[0].atan();
      let v = Math.atan(Number(args[0])); if (mode === 'deg') v = radToDeg(v); return v;
    }
    case 'sqrt': return hasComplex ? args[0].sqrt() : Math.sqrt(Number(args[0]));
    case 'abs': return hasComplex ? args[0].abs() : Math.abs(Number(args[0]));
    case 'ln': case 'log': return hasComplex ? args[0].log() : Math.log(Number(args[0]));
    case 'log10': return hasComplex ? args[0].log() : Math.log10 ? Math.log10(Number(args[0])) : Math.log(Number(args[0])) / Math.LN10;
    case 'exp': return hasComplex ? args[0].exp() : Math.exp(Number(args[0]));
    case 'pow': return hasComplex ? args[0].pow(args[1]) : Math.pow(Number(args[0]), Number(args[1]));
    case 'max': return Math.max(...args.map(Number));
    case 'min': return Math.min(...args.map(Number));
    default: throw new Error('Unknown function: ' + name);
  }
}

// DOM wiring
function setup() {
  const compute = document.getElementById('compute');
  const clear = document.getElementById('clear');
  const exprInput = document.getElementById('expression');

  compute.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      const res = evaluateExpression(exprInput.value || '');
      renderMessage(String(res));
    } catch (err) {
      renderMessage('Error: ' + err.message);
    }
  });

  clear.addEventListener('click', (e) => {
    e.preventDefault();
    exprInput.value = '';
    renderMessage('');
  });

  // insert buttons
  document.querySelectorAll('.insert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const insert = btn.getAttribute('data-insert') || '';
      insertAtCursor(exprInput, insert);
      exprInput.focus();
    });
  });
}

if (typeof window !== 'undefined') window.addEventListener('DOMContentLoaded', setup);

function insertAtCursor(input, text) {
  try {
    const start = input.selectionStart || input.value.length;
    const end = input.selectionEnd || input.value.length;
    const before = input.value.substring(0, start);
    const after = input.value.substring(end);
    input.value = before + text + after;
    const pos = start + text.length;
    input.setSelectionRange(pos, pos);
  } catch (err) {
    input.value += text;
  }
}
