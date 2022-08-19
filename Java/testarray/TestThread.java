//文件是TestThread.java
class RunnableDemo implements Runnable {
   private Thread t;
   private String threadName;

   RunnableDemo(String name) {
      threadName = name;
      System.out.println("创建" + threadName);
   }

   public void run() {
      System.out.println("运行中" + threadName);
      try {
         for (int i = 4; i > 0; i--) {
            System.out.println("线程" + threadName + ", " + i);
            Thread.sleep(50);
         }
      } catch (InterruptedException e) {
         System.out.println("线程" + threadName + "中断");
      }
      System.out.println("线程" + threadName + "退出");
   }

   public void start() {
      System.out.println("开始" + threadName);
      if (t == null) {
         t = new Thread(this, threadName);
         t.start();
      }
   }
}

public class TestThread {
   public static void main(String args[]) {
      RunnableDemo R1 = new RunnableDemo(" 11");
      R1.start();
      RunnableDemo R2 = new RunnableDemo(" 22");
      R2.start();
   }
}