// ─── Archer Profile ───────────────────────────────────────────────────────────

export type Handedness = 'RH' | 'LH';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro/Coach';
export type Discipline = 'Target/3D' | 'Bowhunting' | 'Both';

export interface ArcherProfile {
  name: string;
  handedness: Handedness;
  experience: ExperienceLevel;
}

// ─── Tool Inventory ───────────────────────────────────────────────────────────

export type Tool =
  | 'Allen wrench set'
  | 'Measuring tape'
  | 'Bow square'
  | 'Arrow level'
  | 'String level'
  | 'Bow vice'
  | 'Draw weight scale'
  | 'Nocking pliers'
  | 'Serving thread'
  | 'Serving tool'
  | 'Lighter'
  | 'Razor blade'
  | 'Paper tuning frame'
  | 'Bow press'
  | 'Draw board'
  | 'Chronograph'
  | 'Spine tester'
  | 'Arrow saw'
  | 'Arrow fletching jig';

export const ALL_TOOLS: Tool[] = [
  'Allen wrench set',
  'Measuring tape',
  'Bow square',
  'Arrow level',
  'String level',
  'Bow vice',
  'Draw weight scale',
  'Nocking pliers',
  'Serving thread',
  'Serving tool',
  'Lighter',
  'Razor blade',
  'Paper tuning frame',
  'Bow press',
  'Draw board',
  'Chronograph',
  'Spine tester',
  'Arrow saw',
  'Arrow fletching jig',
];

// ─── Rest Types ───────────────────────────────────────────────────────────────

export type RestType =
  | 'Drop-away (cable)'
  | 'Drop-away (limb)'
  | 'Full capture'
  | 'Shoot-through';

// ─── Sight Types ──────────────────────────────────────────────────────────────

export type SightType = 'Single pin' | 'Multi pin';

// ─── Nock Types ───────────────────────────────────────────────────────────────

export type NockType = 'Standard' | 'Lighted' | 'Half-moon' | 'Capture';

// ─── Fletching ────────────────────────────────────────────────────────────────

export type FletchingType = 'Plastic vane' | 'Feather' | 'Hybrid';
export type VaneConfiguration = '3 fletch' | '4 fletch' | 'Helical' | 'Straight';

// ─── Release ─────────────────────────────────────────────────────────────────

export type ReleaseType = 'Wrist strap' | 'Thumb button' | 'Hinge' | 'Back tension' | 'Other';

// ─── Bow Profile ─────────────────────────────────────────────────────────────

export interface BowProfile {
  id: string;
  nickname: string;
  manufacturer: string;
  model: string;
  year?: number;
  drawWeight: number;
  drawLength: number;
  restType: RestType;
  restManufacturer?: string;
  restModel?: string;
  sightType: SightType;
  sightManufacturer?: string;
  sightModel?: string;
  // Tuning state
  setupComplete: boolean;
  setupStepsComplete: number[];
  setupData: BowSetupData;
  tuningModulesComplete: string[];
}

// ─── Setup Data (measurements recorded during setup) ─────────────────────────

export type NockingPointOption = 'dloop-both' | 'dloop-below' | 'dloop-only';

export interface BowSetupData {
  // Step 1: Safety Check
  safetyCheckPassed?: boolean;
  safetyIssuesFound?: string[];

  // Step 2: Brace Height & A2A
  measuredBraceHeight?: number;
  measuredAxleToAxle?: number;
  braceHeightInSpec?: boolean;
  axleToAxleInSpec?: boolean;

  // Step 3: Rest Installation
  restInstalled?: boolean;

  // Step 4: Nocking Point / D-Loop
  nockingPointOption?: NockingPointOption;
  dloopInstalled?: boolean;

  // Step 5: Centershot
  centershortVerified?: boolean;

  // Step 6: Draw Weight
  limbBoltTurnsFromMax?: number;
  estimatedDrawWeight?: number;

  // Step 7: Coarse Draw Length
  wingspan?: number;
  calculatedDrawLength?: number;
  modulePosition?: string;

  // Step 8: Sight Installation & Axis
  sightMounted?: boolean;
  secondAxisSet?: boolean;
  thirdAxisRoughSet?: boolean;

  // Step 9: Peep Sight
  peepInserted?: boolean;
  peepTemporaryTied?: boolean;

  // Step 10: Drop-Away Rest Timing
  restTimingVerified?: boolean;

  // Step 11: Stabilizer
  stabilizerInstalled?: boolean;
  roughBalanceAchieved?: boolean;

  // Step 12: First Axis
  firstAxisSet?: boolean;
}

// ─── Arrow Profile ────────────────────────────────────────────────────────────

export interface ArrowProfile {
  id: string;
  manufacturer: string;
  model: string;
  length: number;
  spine: number;
  pointWeight: number;
  nockType: NockType;
  fletchingType: FletchingType;
  vaneConfiguration: VaneConfiguration;
}

// ─── Release Profile ─────────────────────────────────────────────────────────

export interface ReleaseProfile {
  type: ReleaseType;
  brand?: string;
  model?: string;
}

// ─── Session Summary ──────────────────────────────────────────────────────────

export type ModuleType = 'Setup' | 'Form' | 'Tune' | 'Score' | 'Shot Analyzer';

export interface SessionSummary {
  module: ModuleType;
  step?: string;
  timestamp: number;
}

// ─── Scoring Types ───────────────────────────────────────────────────────────

export type ScoringFormat = 'ASA' | 'IBO' | 'NFAA';

export interface ScoringFormatConfig {
  format: ScoringFormat;
  label: string;
  description: string;
  defaultTargets: number;
  zones: ScoringZone[];
  maxScorePerTarget: number;
}

export interface ScoringZone {
  value: number;
  label: string;
  description?: string;
}

export interface ShotScore {
  targetNumber: number;
  score: number;
  zoneName: string;
  distance?: number;
  notes?: string;
}

export interface ScoringRound {
  id: string;
  format: ScoringFormat;
  date: number;
  bowId?: string;
  location?: string;
  totalTargets: number;
  shots: ShotScore[];
  totalScore: number;
  completed: boolean;
  notes?: string;
}

// ─── Bow Database Types ───────────────────────────────────────────────────────

export type CamType = 'Single' | 'Binary' | 'Hybrid' | 'Solo';

export interface ModuleDrawLengthMap {
  position: string;
  drawLength: number;
}

export interface BowSpec {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  drawWeightMin: number;
  drawWeightMax: number;
  drawLengthMin: number;
  drawLengthMax: number;
  braceHeightMin: number;
  braceHeightMax: number;
  axleToAxle: number;
  camType: CamType;
  letOff: number;
  massWeight: number;
  iboSpeed: number;
  limbBoltMaxTurns: number;
  limbBoltLbsPerTurn: number;
  stringLength: number;
  cableLengths: number[];
  moduleDrawLengthMap: ModuleDrawLengthMap[];
  camShimmingAvailable: boolean;
  camShimmingInstructions?: string;
  limbPocketAdjustment: boolean;
  limbPocketInstructions?: string;
  specialtyTuningSystems?: string;
  bowPressRequiredForModules: boolean;
}

// ─── Sight Database Types ─────────────────────────────────────────────────────

export type SightMountingType = 'Universal' | 'Picatinny' | 'Dovetail' | 'Through-mount';

export interface SightSpec {
  id: string;
  manufacturer: string;
  model: string;
  mountingType: SightMountingType;
  firstAxisMethod: string;
  firstAxisLocation: string;
  secondAxisMethod: string;
  secondAxisLocation: string;
  thirdAxisMethod: string;
  thirdAxisLocation: string;
  elevationRange?: string;
  windageRange?: string;
  hasBuiltInLevel: boolean;
  hasVerticalSlider: boolean;
}

// ─── Rest Database Types ──────────────────────────────────────────────────────

export interface RestSpec {
  id: string;
  manufacturer: string;
  model: string;
  restType: RestType;
  cordAttachmentMethod: string;
  horizontalAdjustmentRange?: string;
  verticalAdjustmentRange?: string;
  compatibleWithBowPress: boolean;
}
