//文件是MyDog.java
public class MyDog {

    public static void main(String[] args) {
        // 使用构造器创建两个对象
        Animal dogOne = new Animal("小狗");
        Animal dogTwo = new Animal("大狗");

        // 分别调用对象的成员方法
        dogOne.setAge(4);
        dogOne.printDog();

        dogTwo.setAge(7);
        dogTwo.printDog();
    }
}