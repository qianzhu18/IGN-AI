import * as migration_20260729_131637 from './20260729_131637';
import * as migration_20260729_134353_m1_community_model from './20260729_134353_m1_community_model';

export const migrations = [
  {
    up: migration_20260729_131637.up,
    down: migration_20260729_131637.down,
    name: '20260729_131637',
  },
  {
    up: migration_20260729_134353_m1_community_model.up,
    down: migration_20260729_134353_m1_community_model.down,
    name: '20260729_134353_m1_community_model'
  },
];
