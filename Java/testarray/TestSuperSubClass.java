//文件是TestSuperSubClass.java
public class TestSuperSubClass {
    public static void main(String args[]) {
      System.out.println("SubClass1类继承");
      SubClass1 sc1 = new SubClass1();
      SubClass1 sc2 = new SubClass1(100);
      System.out.println("SubClass2类继承");
      SubClass2 sc3 = new SubClass2();
      SubClass2 sc4 = new SubClass2(200);
    }
  }