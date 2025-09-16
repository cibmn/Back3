import { generateMockUsers, insertMockUsers } from "../services/mockingService.js";
import { generateMockProducts, insertMockProducts } from "../services/productsService.js";
import UserDto from "../dtos/userDto.js";
import ProductDto from "../dtos/productDtos.js";

export async function getMockingUsers(req, res) {
  try {
    const users = await generateMockUsers(50);
    const payload = users.map(u => new UserDto(u));
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error generating mocking users" });
  }
}

export async function generateData(req, res) {
  try {
    let { users = 0, products = 0 } = req.body;



    users = Number(users);
    products = Number(products);

    if (
      !Number.isInteger(users) || users < 0 ||
      !Number.isInteger(products) || products < 0
    ) {
      return res.status(400).json({
        ok: false,
        error: "'users' y 'products' están mal expresados"
      });
    }

    const generatedUsers = await generateMockUsers(users);
    await insertMockUsers(generatedUsers);
    const usersPayload = generatedUsers.map(u => new UserDto(u));

    const generatedProducts = generateMockProducts(products);
    await insertMockProducts(generatedProducts);
    const productsPayload = generatedProducts.map(p => new ProductDto(p));






    res.json({
      ok: true,
      summary: {
        requested: { users, products },
        inserted: { users: usersPayload.length, products: productsPayload.length }
      },
      preview: {
        users: usersPayload.slice(0, 3),
        products: productsPayload.slice(0, 3)
      },
      note: "Verifica con GET /api/users y GET /api/products"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error generating data" });
  }
}
