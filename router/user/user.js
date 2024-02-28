const express = require(`express`);
const user = require(`../../models/user`);
const bcrypt = require(`bcrypt`);
const nodemailer = require("nodemailer");
const router = express.Router();
// Register user
router.post("/", async (req, res) => {
  const latestUser = await user.findOne().sort({ id: -1 });
  const newId = latestUser ? latestUser.id + 1 : 1;
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
      phoneNumber,
      profileImg,
     
    } = req.body;

    // Check if employeeNo or email already exists
    const existingUser = await user.findOne({ $or: [{ employeeNo }, { email }] });

    if (existingUser) {
      return res.status(400).json({ msg: "EmployeeNo or email already exists" });
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
      phoneNumber,
      profileImg,
      id:newId
    });

    const result = await newUser.save();

    // generate token
    const token = await newUser.generateAuthToken();
    // res.send(result); // You may or may not send back the result depending on your requirements
    
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
      subject: "Information",
      text: `Employee No: ${employeeNo}
            First Name: ${firstName}
            Last Name: ${lastName}
            Email: ${email}
            Employee Type: ${employeeType}
            Category: ${category}
            Password: ${password}
            Profile Image: ${profileImg}
            Phone Number: ${phoneNumber} `,
            
    };

    // send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: " + error);
        res.status(404).send("Error occurred while sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).send({message:'User Created Successfully!'});
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
      return res.status(404).send("Users not found");
    }

    const isMatch = await bcrypt.compare(password, usera.password);
    if (isMatch) {
      const token = await usera.generateAuthToken();
      res.cookie('jwt', token, { httpOnly: true, secure: true });
      const data=token
      res.status(201).json({ message: "Login successfully", data: data });
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Invalid login");
  }
});

// update user

router.patch("/",  async (req, res) => {
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
      return res.status(404).json({message: "User not update"});
    }
    res.status(201).json({message: 'User updated successfully'});
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("email exist");
    }
    console.log(error);
    res.status(500).send("Invalid");
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
    res.status(201).json({message: 'User Deleted successfully'});
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all user 

router.get("/", async (req, res) => {
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
          id:1,
          employeeNo: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber:1,
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
                permissions: "$$perm.permissions",
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
      {
        $sort: {
          "id": -1
        }
      },
    ]);

    if (usersWithRolesAndPermissions.length === 0) {
      return res.status(404).json([]);
    }

    res.json(usersWithRolesAndPermissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});


// get user by token

router.get("/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const userWithemail = await user.aggregate([
      {
        $match: {
          'email': email
        }
      },
      {
        $lookup: {
          from: "titles",
          localField: "titles",
          foreignField: "id",
          as: "titleData",
        }
      },
      {
        $lookup: {
          from: "roles",
          localField: "roles",
          foreignField: "id",
          as: "rolesData",
        }
      },
      {
        $project: {
          _id: 0,
          id:1,
          employeeNo: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber:1,
          employeeType: 1,
          category: 1,
          roles: {
            $map: {
              input: "$rolesData",
              as: "perm",
              in: {
                id: "$$perm.id",
                name: "$$perm.name",
                permissions:"$$perm.permissions",
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

    if (!userWithemail|| userWithemail.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(userWithemail[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});


// logout
router.get("/logout",async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("User not authenticated");
    }
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
      
    res.clearCookie(`jwt`)
     await req.user.save();

    res.send("Successfully logged out");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
