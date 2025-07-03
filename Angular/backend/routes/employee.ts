import express, { Request, Response } from 'express';
import Employee from '../models/employe'; // make sure this is also a .ts file

// Define the IEmployee interface or import it from the correct location
interface IEmployee {
  fullName: string;
  organization: string;
  languages: string[];
  mobile: string;
  services: string[];
  email: string;
  profilePhoto?: string;
  vehicleType?: string;
  kycDocs?: any;
  additionalDocs?: any;
}

const router = express.Router();

// POST new employee
router.post('/', async (req: Request, res: Response) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: errorMessage });
  }
});

// GET all employees
router.get('/', async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/add', async (req: Request<{}, {}, IEmployee>, res: Response) => {
  try {
    console.log('Adding new employee:', req.body);
    const {
      fullName,
      organization,
      languages,
      mobile,
      services,
      email,
      profilePhoto,
      vehicleType,
      kycDocs,
      additionalDocs,
    } = req.body;

    const newEmployee = new Employee({
      fullName,
      organization,
      languages,
      mobile,
      services,
      email,
      profilePhoto,
      vehicleType,
      kycDocs,
      additionalDocs,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
