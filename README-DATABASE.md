# Database Setup Guide

## Prerequisites
The database schema has already been created with the migration. Now you need to seed it with problems.

## Option 1: Manual Seeding via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the INSERT statements from the JSON data provided
4. Execute the SQL

## Option 2: Quick Test with Sample Problems

You can quickly test the Random button feature by inserting a few sample problems:

```sql
-- Insert 3 sample problems for testing
INSERT INTO java_problems (number, title, difficulty, input, solution, output) VALUES
(1, 'Find unique/distinct numbers from an array', 'basic',
'List<Integer> numbers = List.of(1,2,3,2,4,5,4);
// Output: [1, 2, 3, 4, 5]',
'import java.util.*;
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
}',
'Original: [1, 2, 3, 2, 4, 5, 4]
Unique: [1, 2, 3, 4, 5]'),

(2, 'Filter even numbers from a list', 'basic',
'List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
// Output: [2, 4, 6, 8, 10]',
'import java.util.*;
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
}',
'Original: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Even Numbers: [2, 4, 6, 8, 10]'),

(3, 'Calculate sum of all numbers', 'basic',
'List<Integer> numbers = List.of(1, 2, 3, 4, 5);
// Output: 15',
'import java.util.*;
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
}',
'Numbers: [1, 2, 3, 4, 5]
Sum: 15');
```

## How to Use the Random Button

1. Once problems are seeded in the database, click the **Random** button in the header
2. The app will:
   - Fetch a random Java Stream API problem from the database
   - Display the problem title and difficulty badge above the code editor
   - Show the problem's input/expected output
   - Load the solution code into the editor
3. You can then click **Run** to execute the code and see the output

## Features

- **Purple "Random" button**: Loads a random problem with a gradient purple-to-pink design
- **Problem display**: Shows problem number, title, difficulty badge, and input above the editor
- **Difficulty levels**: Basic (green), Intermediate (blue), Advanced (orange), Expert (red)
- **Mobile responsive**: The Random button adapts to mobile screens

## Database Structure

```sql
Table: java_problems
- id (uuid, primary key)
- number (integer, unique)
- title (text)
- difficulty (text: 'basic', 'intermediate', 'advanced', 'expert')
- input (text)
- solution (text)
- output (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

## Note

The full dataset contains 70 Java Stream API problems across 4 difficulty levels:
- Basic: Problems 1-15
- Intermediate: Problems 16-35
- Advanced: Problems 36-60
- Expert: Problems 61-70

You can insert them all at once or start with the 3 sample problems above to test the functionality.
