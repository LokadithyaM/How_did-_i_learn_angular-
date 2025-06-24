import express, { Request, Response } from 'express';
import Employee from '../models/employe'; // make sure this is also a .ts file

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

export default router;
