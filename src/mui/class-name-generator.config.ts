import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

import { CSS_PREFIX } from '../constants';

ClassNameGenerator.configure((componentName) => CSS_PREFIX + componentName);
