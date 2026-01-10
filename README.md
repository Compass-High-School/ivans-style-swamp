# **🐊 Ivan's Style Swamp**

**The Official Compass High School Mascot Customizer**  
[**🚀 Play the Live Game Here**](https://compass-high-school.github.io/ivans-style-swamp/)  
Welcome to the swamp\! This is the interactive dress-up game for **Ivan the Gator**, the beloved mascot of Compass High School.  
Built to be fast, fun, and full of school spirit, this app lets students, staff, and the community style Ivan for any occasion—whether it's a pep rally, graduation, or a trip to the moon.

## **✨ Features**

* **Wardrobe System:** Mix and match hats, shirts, accessories, and handheld items.  
* **Dynamic Backgrounds:** Transport Ivan from the Bayou to the Classroom or the Disco.  
* **Expression Engine:** Change Ivan's mood (Happy, Cool, Surprised, Silly).  
* **Snapshot Mode:** One-click save feature to download your creation as a PNG.  
* **Custom Uploads:** Upload your own "Base Ivan" to test new artwork instantly.  
* **Mobile First:** Works perfectly on phones and Chromebooks.

## **🎨 For Designers: How to Add New Items**

We love new outfits\! If you are designing new clothes for Ivan, please follow these **"Paper Doll" rules** so they fit perfectly in the code.

### **The Golden Rule: 1080x1080**

Every image file must be the **exact same dimension**, even if the item is small (like a monocle).

1. **Canvas Size:** Set your artboard to 1080px (width) x 1080px (height).  
2. **Positioning:** Draw the item exactly where it should sit on Ivan's body relative to the center.  
3. **Export:** Hide the Ivan body layer and export the **full transparent canvas**.

*Do not crop the image to the item\! The code relies on stacking full-size images on top of each other.*

### **File Naming**

Please use lowercase and underscores:

* hat\_propeller.png  
* shirt\_jersey\_blue.png  
* hand\_pizza.png

## **💻 For Developers: getting Started**

This project is built with **React**, **Vite**, and **Tailwind CSS**.

### **1\. Clone & Install**

git clone \[https://github.com/compass-high-school/ivans-style-swamp.git\](https://github.com/compass-high-school/ivans-style-swamp.git)  
cd ivan-customizer  
npm install

### **2\. Run Locally**

Start the development server:  
npm run dev

Open the link provided (usually http://localhost:5173) to see the Gator in action.

### **3\. Deploy**

This project is configured for **GitHub Pages**. To update the live site:  
npm run deploy

## **🛠 Tech Stack**

* **Framework:** React 18  
* **Build Tool:** Vite (Super fast\!)  
* **Styling:** Tailwind CSS  
* **Icons:** Lucide React

### **💚 Compass High School Spirit**

*Go Navigators\!*