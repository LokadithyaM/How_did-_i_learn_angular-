import express, { Request, Response } from 'express';
import Employee from '../models/employe'; // make sure this is also a .ts file
import multer from 'multer';
import path from 'path';

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

router.delete('/:id', async (req: Request, res: Response) => {
    try{
      const id = parseInt(req.params.id);
      await Employee.findOneAndDelete({ id });
      console.log('Employee deleted:', id);
      res.status(200).json({ message: 'Employee deleted successfully' });
    }catch (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    await Employee.findOneAndUpdate(
      { id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json("Employee updated successfully");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: errorMessage });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.pdf'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

router.post('/upload/photo', upload.single('profilePhoto'), (req: Request, res: Response) => {
  const file = (req as any).file;
  if (!file) {
    res.status(400).send({ error: 'No file uploaded' });
    return;
  }
  res.send({ path: file.path });
});

router.post('/upload/docs', upload.fields([
  { name: 'kycDocs', maxCount: 5 },
  { name: 'additionalDocs', maxCount: 5 }
]), (req: Request, res: Response) => {
  const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] };

  const kycPaths = files?.kycDocs?.map(file => file.path) || [];
  const additionalPaths = files?.additionalDocs?.map(file => file.path) || [];

  res.send({ kycDocs: kycPaths, additionalDocs: additionalPaths });
});

export default router;
