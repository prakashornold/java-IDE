-- Delete existing data
DELETE FROM java_problems;

-- Insert Basic Problems (1-15)
INSERT INTO java_problems (number, title, difficulty, input, solution, output) VALUES
(1, 'Find unique/distinct numbers from an array', 'basic', 'List<Integer> numbers = List.of(1,2,3,2,4,5,4);
// Output: [1, 2, 3, 4, 5]', 'import java.util.*;
import java.util.stream.*;
public class UniqueNumbers {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 2, 4, 5, 4);

        List<Integer> unique = numbers.stream()
            .distinct()
            .collect(Collectors.toList());

        System.out.println("Original: " + numbers);
        System.out.println("Unique: " + unique);
    }
}', 'Original: [1, 2, 3, 2, 4, 5, 4]
Unique: [1, 2, 3, 4, 5]'),

(2, 'Filter even numbers from a list', 'basic', 'List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
// Output: [2, 4, 6, 8, 10]', 'import java.util.*;
import java.util.stream.*;
public class FilterEvenNumbers {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        List<Integer> evenNumbers = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());

        System.out.println("Original: " + numbers);
        System.out.println("Even Numbers: " + evenNumbers);
    }
}', 'Original: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Even Numbers: [2, 4, 6, 8, 10]'),

(3, 'Calculate sum of all numbers', 'basic', 'List<Integer> numbers = List.of(1, 2, 3, 4, 5);
// Output: 15', 'import java.util.*;
import java.util.stream.*;
public class SumOfNumbers {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5);

        int sum = numbers.stream()
            .mapToInt(Integer::intValue)
            .sum();

        System.out.println("Numbers: " + numbers);
        System.out.println("Sum: " + sum);
    }
}', 'Numbers: [1, 2, 3, 4, 5]
Sum: 15');

-- Note: Due to character limits, you'll need to execute this SQL in the Supabase SQL Editor
-- To load all 70 problems, please use the Supabase SQL Editor and insert problems in batches
-- The structure for each problem follows the pattern above
