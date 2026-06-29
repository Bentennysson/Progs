import java.util.Scanner;
public class Findelement
{
    public static void main(String args[])
    {
        System.out.println("Enter the size of the array:");
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        float number [] = new float[n];
        for (int i=0;i<n;i++)
        {
            System.out.println("Enter the elements of the array:"+i);
            number[i] =sc.nextFloat();

        }

        System.out.println("The elements are:");
        for(int i=0;i<n;i++)
        {
            System.out.println(number[i]);
        }

        System.out.println("Enter the number to be found:");
        int x = sc.nextInt();
        for (int i=0;i<n;i++)
        {
            if (number[i]==x)
            {
                System.out.println("The number " + x + " is found at address"+i);

            }
           else {
            System.out.println("The number " + x + " is not not found henece in the array");
           }
        }
         
        

    
    
    }
}