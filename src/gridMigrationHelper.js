/**
 * Grid v2 Migration Helper
 *
 * This file helps suppress Grid v1 deprecation warnings temporarily.
 * Note: This is NOT a long-term solution. You should migrate to Grid v2 syntax.
 *
 * To use: Import Grid2 from this file instead of from @mui/material
 *
 * Example:
 * // Old: import { Grid } from '@mui/material';
 * // New: import { Grid } from './gridMigrationHelper';
 */

import Grid2 from '@mui/material/Unstable_Grid2';

// Re-export as Grid for backward compatibility
export const Grid = Grid2;

export default Grid2;
