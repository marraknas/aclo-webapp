const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const ProductVariant = require("./models/ProductVariant");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const Review = require("./models/Review");
const products = require("./data/products");
const productVariants = require("./data/productVariants");
const reviews = require("./data/reviews");
const orders = require("./data/orders");

dotenv.config();

// HELPERS
async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
  await mongoose.connect(process.env.MONGO_URI);
}

async function clearCollections() {
  await Promise.all([
    Product.deleteMany(),
    ProductVariant.deleteMany(),
    User.deleteMany(),
    Cart.deleteMany(),
    Review.deleteMany(),
    Order.deleteMany(),
  ]);
}

async function createAdminUser() {
  return User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    role: "admin",
  });
}

function findByContains(allProducts, keyword) {
  const k = keyword.toLowerCase();
  return allProducts.find((p) => p.name?.toLowerCase().includes(k));
}

function buildAddOn(productId, options, pricing) {
  return {
    productId,
    ...(options ? { options } : {}),
    pricing: pricing ?? { discountType: "none", amount: 0 },
  };
}

async function attachAddOns({ stork, falcon, quill, talon, quillMittens }) {
  // Use bulkWrite so this is 1 roundtrip instead of 3
  const ops = [
    {
      updateOne: {
        filter: { _id: stork._id },
        update: {
          $set: {
            addOnProducts: [
              buildAddOn(
                talon._id,
                { variant: "Stork" },
                { discountType: "fixed", amount: 100000 }
              ),
            ],
          },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: falcon._id },
        update: {
          $set: {
            addOnProducts: [
              buildAddOn(
                talon._id,
                { variant: "Falcon" },
                { discountType: "fixed", amount: 100000 }
              ),
            ],
          },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: quill._id },
        update: {
          $set: {
            addOnProducts: [
              buildAddOn(quillMittens._id, null, {
                discountType: "none",
                amount: 0,
              }),
            ],
          },
        },
      },
    },
  ];

  await Product.bulkWrite(ops);
}

function buildSampleOrders({ insertedProducts, insertedVariants, userId }) {
  const p0 = insertedProducts[0];
  if (!p0) throw new Error("No products inserted; cannot build sample orders.");

  const p0Variant = insertedVariants.find(
    (pv) => pv.productId.toString() === p0._id.toString()
  );

  if (!p0Variant) {
    throw new Error(
      `No variant found for first product (${p0.name}). Check your variant mappings.`
    );
  }

  return orders.map((order) => ({
    ...order,
    user: userId,
    orderItems: [
      {
        productId: p0._id,
        productVariantId: p0Variant._id,
        name: p0.name,
        image:
          p0Variant.images?.[0]?.publicId || p0Variant.images?.[0]?.alt || "",
        price: p0Variant.discountPrice ?? p0Variant.price,
        weight: p0.weight || 0,
        quantity: 1,
      },
    ],
  }));
}

// SEEDER
const seedData = async () => {
  try {
    await connectDB();
    await clearCollections();

    // create default admin user
    const admin = await createAdminUser();
    const userId = admin._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: userId };
    });
    // Insert Products
    const insertedProducts = await Product.insertMany(sampleProducts);

    // Grab all the products
    const stork = findByContains(insertedProducts, "stork");
    const falcon = findByContains(insertedProducts, "falcon");
    const talon = findByContains(insertedProducts, "talon");
    const quill = findByContains(insertedProducts, "kitchen utensils");
    const quillMittens = findByContains(insertedProducts, "oven mitt");
    const sparrow = findByContains(insertedProducts, "sparrow");
    const beak = findByContains(insertedProducts, "beak");

    if (
      !stork ||
      !falcon ||
      !talon ||
      !quill ||
      !quillMittens ||
      !sparrow ||
      !beak
    ) {
      throw new Error(
        "One or more products not found by name. Check your seed product names exactly."
      );
    }

    // Inject addOnProducts into STORK and FALCON with TALON add-on
    // Inject addOnProducts into QUILL with Oven mitten add-on
    // With: Correct variant option & bundle pricing discount
    await attachAddOns({ stork, falcon, quill, talon, quillMittens });

    // Insert productId mappings for all Product Variants
    const variantsWithProductId = productVariants.map((variant) => {
      const sku = variant.sku;
      if (sku === "QL-MT") {
        return {
          ...variant,
          productId: quillMittens._id,
        };
      }
      if (sku === "QL-UT") {
        return {
          ...variant,
          productId: quill._id,
        };
      }
      if (sku.startsWith("ST-")) {
        return {
          ...variant,
          productId: stork._id,
        };
      }
      if (sku.startsWith("FL-")) {
        return {
          ...variant,
          productId: falcon._id,
        };
      }
      if (sku.startsWith("TA-")) {
        return {
          ...variant,
          productId: talon._id,
        };
      }
      if (sku.startsWith("SP-")) {
        return {
          ...variant,
          productId: sparrow._id,
        };
      }
      if (sku === "BE") {
        return {
          ...variant,
          productId: beak._id,
        };
      }
      throw new Error(`Unknown SKU in productVariants seed: ${sku}`);
    });

    const insertedVariants = await ProductVariant.insertMany(
      variantsWithProductId
    );

    // Retrieve the first product & it's variant and create a sample Order with it
    const sampleOrders = buildSampleOrders({
      insertedProducts,
      insertedVariants,
      userId,
    });

    // Insert add on products for the right products

    await Review.insertMany(reviews);
    await Order.insertMany(sampleOrders);

    console.log("Mock data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data: ", error);
    process.exit(1);
  }
};

seedData();
