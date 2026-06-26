 import java.util.Scanner;
 public class Circumference
{
    public static float Circum(float radius)
    {
        float circumference = 2 * radius * (float)Math.PI;
        return circumference;
    }
    
    public static void main(String args[]){
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the radius of the circle:");
        float radius = sc.nextFloat();
        float Circu = Circum(radius);
        System.out.println("The circumference of the circle is:" + Circu);
    }

}
