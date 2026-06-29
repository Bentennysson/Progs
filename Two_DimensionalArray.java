import java.util.Scanner;
public class Two_DimensionalArray
{
    public static void main (String args[])
    {
        int i;
        int j;
        System.out.println("Enter the number of the rows & columns:");
        Scanner k = new Scanner(System.in);
        int row = k.nextInt();
        int columns = k.nextInt();
        float numbers[][]= new float[row][columns];
        for (i=0;i<=row-1;i++)
        {
            for (j=0 ; j<=columns-1;j++){
                System.out.println("Enter the number at the address : " + i + " x " + j );
                 numbers[i][j]=k.nextFloat();
            }
        }
        System.out.println();

        for (i=0;i<=row-1;i++)
        {
            for (j=0 ; j<=columns-1;j++){
               
                System.out.print(numbers[i][j] + " ");
               

                
            }
            System.out.println();
        }
        // To find the Element in the table for the 2_dimension array//
        System.out.println("Enter the value that has to be found : ");
        float x= k.nextFloat();

        for (i= 0; i<= row-1;i++)
        {
            
            for (j=0;j<=columns-1;j++)
            {
               if (numbers[i][j]==x)
                {
                System.out.println("The number is found at the address " + i + " x " + j);
                }
               else if ( numbers[i][j]!=x)
                {
                    System.out.println("The number " +  x + " is not found ");
                 }     
           }
        
        }

         
              
    }
}