import * as migration_20260729_131637 from './20260729_131637';
import * as migration_20260729_134353_m1_community_model from './20260729_134353_m1_community_model';
import * as migration_20260729_144749_m1_integrity_preview from './20260729_144749_m1_integrity_preview';
import * as migration_20260729_152845_m2_source_tracking from './20260729_152845_m2_source_tracking';

export const migrations = [
  {
    up: migration_20260729_131637.up,
    down: migration_20260729_131637.down,
    name: '20260729_131637',
  },
  {
    up: migration_20260729_134353_m1_community_model.up,
    down: migration_20260729_134353_m1_community_model.down,
    name: '20260729_134353_m1_community_model',
  },
  {
    up: migration_20260729_144749_m1_integrity_preview.up,
    down: migration_20260729_144749_m1_integrity_preview.down,
    name: '20260729_144749_m1_integrity_preview',
  },
  {
    up: migration_20260729_152845_m2_source_tracking.up,
    down: migration_20260729_152845_m2_source_tracking.down,
    name: '20260729_152845_m2_source_tracking'
  },
];
