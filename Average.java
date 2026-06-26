import java.util.Scanner;

public class Average{
    public static double CalculateSum(float values[]) {
        float sum =0;
        for (float value: values){
            sum +=value;
        }
        return sum;
    }
    public static double CalculateAverage(float values[]) {
        if(values.length ==0)
        {
            System.out.println("No values provided.");
            return 0;
        }
        else{
            double sum = CalculateSum(values);
            return sum/values.length;

        }
    }

    public static void main(String args[]){
        Scanner Sc1 = new Scanner(System.in);
        System.out.println("Enter the range of values:");
        double n = Sc1.nextDouble();
        Scanner sc2 = new Scanner(System.in);
        float values[] = new float[(int)n];
        System.out.println("Enter the values:");
        for (int i=0; i<n; i++){
            values[i] = sc2.nextFloat();
        }
        System.out.println("The sum is: " + CalculateSum(values));
        System.out.println("The average is: " + CalculateAverage(values));

    }
}