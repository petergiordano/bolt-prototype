import type { Meta, StoryObj } from '@storybook/react';
import { ActivityShell } from './ActivityShell';

const meta: Meta<typeof ActivityShell> = {
  title: 'Layout/ActivityShell',
  component: ActivityShell,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Demo Activity',
    subtitle: 'Showing the standard shell',
    currentStep: 2,
    totalSteps: 3,
    userKey: 'ABC123XYZ789',
    onReset: () => alert('reset clicked'),
  },
};
export default meta;

type Story = StoryObj<typeof ActivityShell>;

export const ThreeStep: Story = {
  render: (args) => (
    <ActivityShell {...args}>
      <div className="p-6 text-center">Your activity content here.</div>
    </ActivityShell>
  ),
};

export const FourStep: Story = {
  args: { totalSteps: 4 },
  render: ThreeStep.render,
};