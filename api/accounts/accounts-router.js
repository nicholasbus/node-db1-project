const router = require("express").Router();
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
} = require("../accounts/accounts-middleware");
const Accounts = require("./accounts-model");

router.get("/", async (req, res, next) => {
  try {
    const allAccounts = await Accounts.getAll();
    res.status(200).json(allAccounts);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", checkAccountId, async (req, res) => {
  res.status(200).json(req.account);
});

router.post(
  "/",
  checkAccountPayload,
  checkAccountNameUnique,
  async (req, res, next) => {
    const { name, budget } = req.body;

    try {
      const newAccount = await Accounts.create({ name, budget });
      res.status(201).json(newAccount);
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  "/:id",
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const editedAccount = await Accounts.updateById(req.params.id, req.body);
      res.status(200).json(editedAccount);
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/:id", checkAccountId, async (req, res, next) => {
  try {
    const deletedAccount = await Accounts.deleteById(req.params.id);
    res.status(201).json(deletedAccount);
  } catch (e) {
    next(e);
  }
});

router.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(500).json({
    message: "There was an error",
    errorMessage: err.message,
  });
});

module.exports = router;
