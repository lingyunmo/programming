//文件是SuperClass.java
class SuperClass {
  private int n;

  SuperClass() {
    System.out.println("SuperClass()");
  }

  SuperClass(int n) {
    System.out.println("SuperClass(int n)");
    this.n = n;
  }
}

class SubClass1 extends SuperClass {
  private int n;

  // 自动调用父类的无参数构造方法
  SubClass1() {
    System.out.println("SubClass1");
  }

  public SubClass1(int n) {
    // 调用父类中带有参数的构造方法
    super(300);
    System.out.println("SubClass1(int n):" + n);
    this.n = n;
  }
}

class SubClass2 extends SuperClass {
  private int n;

  SubClass2() {
    // 调用父类中带有参数的构造方法
    super(300);
    System.out.println("SubClass2");
  }

  // 自动调用父类的无参数构造方法
  public SubClass2(int n) {
    System.out.println("SubClass2(int n):" + n);
    this.n = n;
  }
}