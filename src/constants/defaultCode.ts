export const DEFAULT_JAVA_CODE = `public class Welcome {
    public static void main(String[] args) {
        System.out.println("Welcome to Java Practice Platform!");
        System.out.println("Write your code here and click Run to execute.");
    }
}`;

export const INTERVIEW_MODE_CODE = `import java.util.*;
import java.util.stream.*;
import java.io.*;

public class InterviewPractice {
    public static void main(String[] args) {
        System.out.println("╔════════════════════════════════════════════╗");
        System.out.println("║   Welcome to JavaCodingPractice.com       ║");
        System.out.println("║   Interview Mode - Full Screen Editor     ║");
        System.out.println("╚════════════════════════════════════════════╝");
        System.out.println();
        System.out.println("🚀 Ready to code? Start writing your solution here!");
        System.out.println("✨ Features:");
        System.out.println("   • Full-screen coding environment");
        System.out.println("   • Instant code execution");
        System.out.println("   • 10 free runs without login");
        System.out.println("   • Pre-imported: java.util.*, java.util.stream.*, java.io.*");
        System.out.println();
        System.out.println("💡 Quick Example:");

        // Example: Stream operations
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        int sum = numbers.stream()
                        .mapToInt(Integer::intValue)
                        .sum();
        System.out.println("   Sum using streams: " + sum);

        // Example: String operations
        String message = "Happy Coding!";
        System.out.println("   Message: " + message);
        System.out.println("   Length: " + message.length());

        System.out.println();
        System.out.println("🎯 Clear the editor and start coding your solution!");
        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
}`;
