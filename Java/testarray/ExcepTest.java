import java.io.*;
public class ExcepTest{
 
   public static void main(String args[]){
      try{
         int a[] = new int[2];
         System.out.println("允许三个元素:" + a[3]);
      }catch(ArrayIndexOutOfBoundsException e){
         System.out.println("异常抛出:" + e);
      }
      System.out.println("数组下标越界");
   }
}