public static void number(float values[], String operators)
{
    System.out.print("The numbers are:");
    for (int i = 0; i < values.length; i++) {
        System.out.print(values[i]);
        if (i < values.length - 1) System.out.print(", ");
    }
    System.out.println();
    System.out.println("The length=" + values.length);

    System.out.print("The operators are:");
    for (int i = 0; i < operators.length(); i++) {
        System.out.print(operators.charAt(i));
        if (i < operators.length() - 1) System.out.print(", ");
    }
    System.out.println();
    System.out.println("The length=" + operators.length());
        
}

public static void Calculate(float values[], String operators)
{
    if (values.length == 0) {
        System.out.println("No values provided");
        return;
    }
    float result = values[0];
    for (int i = 0; i < operators.length(); i++) {
        char op = operators.charAt(i);
        float next = values[i+1];
        if (op == '+')      result = result + next;
        else if (op == '-') result = result - next;
        else if (op == '*') result = result * next;
        else if (op == '/') result = result / next;
    }
    System.out.print("The result is:" + result);
}


public static void main(String args[])
{
    Scanner sc=new Scanner(System.in);
    System.out.print("Enter the number of values:");
    int n=sc.nextInt();
    float values[]=new float[n];
    String operators="";
    for (int i=0; i<=n-1; i++)
    {
        System.out.print("Enter the value "+(i+1)+":");
        values[i]=sc.nextFloat();
        if (i<n-1)
        {
            System.out.print("Enter the operator:");
            operators+=sc.next();
        }
    }
    number(values,operators);
    Calculate(values,operators);
}