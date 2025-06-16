import type { Meta, StoryObj } from '@storybook/react';
import { StickyHeader } from './StickyHeader';

const meta: Meta<typeof StickyHeader> = {
  title: 'Layout/StickyHeader',
  component: StickyHeader,
  args: {
    title: 'Problem Validation',
    subtitle: 'Activity 2 of 3',
    currentStep: 1,
    totalSteps: 3,
    userKey: 'ABC123XYZ789',
  },
};
export default meta;

type Story = StoryObj<typeof StickyHeader>;

export const Default: Story = {};
export const Step2of4: Story = {
  args: { currentStep: 2, totalSteps: 4 },
};