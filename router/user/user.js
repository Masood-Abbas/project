const express = require(`express`);
const user = require(`../../models/user`);
const Role = require(`../../models/roles`);
const bcrypt = require(`bcrypt`);
const nodemailer = require("nodemailer");
const auth = require(`../../middleware/auth`);
const router = express.Router();
// Register user
router.post("/", auth, async (req, res) => {
  try {
    const {
      employeeNo,
      firstName,
      lastName,
      email,
      employeeType,
      category,
      password,
      titles,
      roles,
      profileImg,
    } = req.body;

    if (user.employeeNo === employeeNo) {
      return res.json({ msg: "employeeNo is present" });
    }

    const newUser = new user({
      employeeNo,
      firstName,
      lastName,
      email,
      employeeType,
      category,
      password,
      titles,
      roles,
      profileImg,
    });

    const result = await newUser.save();

    // generate token
    const token = await newUser.generateAuthToken();
    res.header(`x-auth-token`, token);
    res.send(result);
    // Email
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "information",
      text: `Employe No: ${employeeNo}
            First Name: ${firstName}
            Last Name: ${lastName}
            Email: ${email}
            Employe-type: ${employeeType}
            Catgory: ${category}
            password: ${password}
            Profile_img: ${profileImg}`,
    };

    // send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: " + error);
        res.status(500).send("Error occurred while sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).send("Email sent successfully");
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("User already exists");
    } else {
      console.error(error);
      res.status(500).send("Please enter valid details");
    }
  }
});

// login to user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usera = await user.findOne({ email });
    if (!usera) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, usera.password);
    if (isMatch) {
      const token = await usera.generateAuthToken();
      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(201).send("Login successfully");
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Invalid login");
  }
});
// update user
router.patch("/", auth, async (req, res) => {
  try {
    const { employeeNo, password, ...updateFields } = req.body;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    const updateUser = await user.findOneAndUpdate(
      { employeeNo },
      { ...updateFields },
      {
        new: true,
      }
    );
    if (!updateUser) {
      return res.status(404).send("User not found");
    }
    res.status(201).send(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Invalid");
  }
});
// get all user
router.get("/", auth, async (req, res) => {
  try {
    const users = await user?.find(
      {},
      "firstName lastName category email employeeType employeeNo password id title"
    );
    if (users?.length) {
      res.status(201).json(users);
    } else {
      res.status(404).send("users not found");
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("change email");
    }
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});
// Delete the user
router.delete(`/:employeeNo`, async (req, res) => {
  try {
    const employeeNo = req.params.employeeNo;
    const deleteUser = await user.deleteOne({ employeeNo });
    if (!employeeNo) {
      console.log(error);
      return res.status(404).send(error);
    }
    res.status(201).send(deleteUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get", async (req, res) => {
  try {
    const usersWithRolesAndPermissions = await user.aggregate([
      {
        $lookup: {
          from: "titles",
          localField: "titles",
          foreignField: "id",
          as: "titleData",
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "roles",
          foreignField: "id",
          as: "rolesData",
        },
      },
      {
        $project: {
          _id: 0,
          employeeNo: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          employeeType: 1,
          category: 1,
          roles: {
            $map: {
              input: "$rolesData",
              as: "perm",
              in: {
                id: "$$perm.id",
                name: "$$perm.name",
              },
            },
          },
          titles: {
            $map: {
              input: "$titleData",
              as: "perm",
              in: {
                id: "$$perm.id",
                name: "$$perm.name",
              },
            },
          },
        },
      },
    ]);

    if (usersWithRolesAndPermissions.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    res.json(usersWithRolesAndPermissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

//search api

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;

    let usersWithRolesAndPermissions;

    if (query) {
      // If a query is provided, perform a search based on the user's first name or last name
      usersWithRolesAndPermissions = await user.aggregate([
        {
          $lookup: {
            from: 'titles',
            localField: 'titles',
            foreignField: 'id',
            as: 'titleData',
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'roles',
            foreignField: 'id',
            as: 'rolesData',
          },
        },
        {
          $match: {
            $or: [
              { firstName: { $regex: new RegExp(query, 'i') } },
              { lastName: { $regex: new RegExp(query, 'i') } },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            employeeNo: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            employeeType: 1,
            category: 1,
            roles: {
              $map: {
                input: '$rolesData',
                as: 'perm',
                in: {
                  id: '$$perm.id',
                  name: '$$perm.name',
                },
              },
            },
            titles: {
              $map: {
                input: '$titleData',
                as: 'perm',
                in: {
                  id: '$$perm.id',
                  name: '$$perm.name',
                },
              },
            },
          },
        },
      ]);
    } else {
      usersWithRolesAndPermissions = await user.aggregate([
        {
          $lookup: {
            from: 'titles',
            localField: 'titles',
            foreignField: 'id',
            as: 'titleData',
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'roles',
            foreignField: 'id',
            as: 'rolesData',
          },
        },
        {
          $project: {
            _id: 0,
            employeeNo: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            employeeType: 1,
            category: 1,
            roles: {
              $map: {
                input: '$rolesData',
                as: 'perm',
                in: {
                  id: '$$perm.id',
                  name: '$$perm.name',
                },
              },
            },
            titles: {
              $map: {
                input: '$titleData',
                as: 'perm',
                in: {
                  id: '$$perm.id',
                  name: '$$perm.name',
                },
              },
            },
          },
        },
      ]);
    }

    if (usersWithRolesAndPermissions.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    res.json(usersWithRolesAndPermissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});


// logout
router.get("/logout", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("User not authenticated");
    }
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    const result = await req.user.save();
    console.log(result);
    res.setHeader("Authorization", "");
    res.send("Successfully logged out");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
