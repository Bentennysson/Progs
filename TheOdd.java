import java.util.Scanner;

public class TheOdd {
   public static void OddIdentify(float values[]) {
    for (int i=0; i<values.length; i++){
        if(values[i]%2!=0){
            System.out.println("The odd numbers are:" + values[i]);
            }
        }
    
       }
       
    public static float OddSum(float values[]) {
        float sum =0;
        for (float value: values){
            if(value%2!=0){
                sum +=value;
            }
        }
        return sum;
    }
    public static void main(String args[]){
        Scanner Sc1 =new Scanner(System .in);
        System.out.println("Enter the number of values:");
        int n = Sc1.nextInt();
        Scanner Sc2 = new Scanner(System.in);
        float Values[] = new float[n];
        System.out.println("Enter the values:");
        for (int k=0; k<n; k++){
            Values[k] = Sc2.nextFloat();
        }
        System.out.println("The odd numbers are:");
        OddIdentify(Values);
        System.out.println("The sum of odd numbers is: " + OddSum(Values));
    }

}

