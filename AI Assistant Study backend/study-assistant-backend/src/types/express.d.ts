// Forces TypeScript to include @types/multer global augmentation (Express.Multer.File)
// Required because moduleResolution: "nodenext" doesn't auto-include global augmentations
import 'multer';
