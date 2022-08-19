public class TestArray {
   public static void main(String[] args) {
      double[] myList = { 59.6, 60.3, 61.7, 62.8 };
      for (double i : myList) {
         System.out.println(i);
      }
      String[][] s = new String[2][];
      s[0] = new String[2];
      s[1] = new String[3];
      s[0][0] = new String("新");
      s[0][1] = new String("年");
      s[1][0] = new String("快");
      s[1][1] = new String("乐");
      s[1][2] = new String("!");

   }
}