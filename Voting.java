import java.util.Scanner;

public class Voting 
{
    public static float VotingEligible(float age)
    {
        if(age>=18)
        {
            System.out.println("The Person is eligible for the voting");
        }
        
        else
        {
            System.out.println("The Person is not eligible for the voting");
        }
        return age;
    }

    public static void main(String args[])
    {
        System.out.println("Enter the age of the person to check the eligibility for the voting:");
        Scanner sc = new Scanner(System.in);
        float Age  =sc.nextFloat();
        VotingEligible(Age);
    }
}