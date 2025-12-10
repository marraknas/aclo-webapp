# aclo-webapp

An E-commerce website for Aclo Kids

Stack: MERN (ReactTS, TailwindCSS)

Media Files:

- https://drive.google.com/drive/folders/1SKppfBxIqeFtCQiOBIFwNS9com7imV_C
- https://drive.google.com/drive/folders/1u_drSFTyd-MdUcTf0afZx_hcs3mwmQIZ
- logos: https://drive.google.com/drive/folders/105wbnh_jKl8X2LCaxE1s6me20ELkgiL3
- logos transparent bg: https://drive.google.com/drive/folders/109eZM1VNZ92N6tEZLiyKQmWISz2SndFC
- promotional slides: https://drive.google.com/drive/folders/15lcxXwzA0nVio-R_7abX4SUCfhr_7Lr2

Current static website here: https://aclokids.com/ <br>
Current tokopedia: https://www.tokopedia.com/aclokids <br>
Youtube tutorial video: https://www.youtube.com/watch?v=hpgh2BTtac8 <br>
Figma design (By Celine): https://www.figma.com/design/wT9UGae3tDgkw4Ymoeaa2h/Savourly?t=XLFq4LwYPP0BIBgZ-0

Project Structure:
FRONTEND:
components - contain all usable components that can be used across multiple pages

- admin - admin section comps like admin dashboard, order management, user management
- cart - shopping cart, checkout, payment button
- common - header, footer, navbar
- layout - user layout, hero layout, cart drawer
- products - product details, product price <br>

Pages - all pages components (either full page or a route):

- home
- admin home
- login
- collection

Axios used for calling our api servers
A redux Slice is a piece of the app's state

Packages needed for BACKEND:

- express - nodeJs framework to build APIs,
- mongoose - object data modelling lib for mongoDB to define schemas for our data & querying from database,
- dotenv - load env variables from .env file,
- jsonwebtoken - authentication & authorizxation of users,
- bcryptjs - for hashing passwords stored in the website,
- cors - to connect FE and BE because FE and BE are hosted on diff domains,
- nodemon - dev tool that restarts server whenever we save changes instead of manually restarting everytime
- multer - handling file uploads and stores them in memory
- cloudinary - help communicate with cloudinary API
- streamifier - convert chunks of data into streams

To run FE, cd into the frontend folder and run `npm run dev` <br>
To run BE, cd into the backend folder and run `npm run dev`

BACKEND note:
We are allowing users to create a cart even if they're not logged in (i.e. guest users). But guest users aren't allowed to checkout.
If they login, it will be converted into a User Cart, hence the merge cart functionality in the api

We will be using Redux as our state manager. we can store and manage the shared states easily

Documentations:

1. Biteship Docs - API used for calculating shipping costs https://biteship.com/en/docs/intro
2. React Icons - Icons by react https://react-icons.github.io/react-icons/search/#q=
3. Paypal Developer - Will not be used, but the current setup is such that we are using Paypal API. So can use for reference: https://developer.paypal.com/
4. Cloudinary Docs - For image uploads: https://cloudinary.com/documentation/image_upload_api_reference
