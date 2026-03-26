import { ScoringFormatConfig } from '@/types';

export const SCORING_FORMATS: ScoringFormatConfig[] = [
  {
    format: 'ASA',
    label: 'ASA',
    description: 'Archery Shooters Association — 3D targets, 20 per round',
    defaultTargets: 20,
    zones: [
      { value: 14, label: '14', description: 'Inner 14 ring (bonus)' },
      { value: 12, label: '12', description: '12 ring (center vitals)' },
      { value: 10, label: '10', description: '10 ring (vitals)' },
      { value: 8, label: '8', description: '8 ring (body)' },
      { value: 5, label: '5', description: '5 ring (outer body)' },
      { value: 0, label: 'M', description: 'Miss' },
    ],
    maxScorePerTarget: 14,
  },
  {
    format: 'IBO',
    label: 'IBO',
    description: 'International Bowhunter Organization — 3D targets, 30 per round',
    defaultTargets: 30,
    zones: [
      { value: 11, label: '11', description: '11 ring (center vitals)' },
      { value: 10, label: '10', description: '10 ring (vitals)' },
      { value: 8, label: '8', description: '8 ring (body)' },
      { value: 5, label: '5', description: '5 ring (outer body)' },
      { value: 0, label: 'M', description: 'Miss' },
    ],
    maxScorePerTarget: 11,
  },
  {
    format: 'NFAA',
    label: 'NFAA',
    description: 'National Field Archery Association — field/hunter/animal rounds',
    defaultTargets: 28,
    zones: [
      { value: 5, label: 'X', description: 'X ring (dead center)' },
      { value: 5, label: '5', description: '5 ring (center)' },
      { value: 4, label: '4', description: '4 ring' },
      { value: 3, label: '3', description: '3 ring' },
      { value: 0, label: 'M', description: 'Miss' },
    ],
    maxScorePerTarget: 5,
  },
];

export function getFormatConfig(format: string): ScoringFormatConfig | undefined {
  return SCORING_FORMATS.find((f) => f.format === format);
}
