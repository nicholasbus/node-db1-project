const { getById, getAll } = require("./accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    res.status(400).json({ message: "name and budget are required" });
  } else if (typeof name !== "string") {
    res.status(400).json({ message: "name of account must be a string" });
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    res
      .status(400)
      .json({ message: "name of account must be between 3 and 100" });
  } else if (typeof budget !== "number") {
    res.status(400).json({ message: "budget of account must be a number" });
  } else if (budget < 0 || budget > 1000000) {
    res
      .status(400)
      .json({ message: "budget of account is too large or too small" });
  } else {
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const allAccounts = await getAll();
    allAccounts.forEach((account) => {
      if (account.name === req.body.name.trim()) {
        res.status(400).json({ message: "that name is taken" });
      }
    });
    next();
  } catch (e) {
    res.status(500).json(e.message);
  }
};

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await getById(req.params.id);
    if (!account) {
      res.status(404).json({ message: "account not found" });
    } else {
      req.account = account;
      next();
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
};
