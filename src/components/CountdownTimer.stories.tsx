import type { Meta, StoryObj } from '@storybook/react';
import { CountdownTimer } from './CountdownTimer';

const meta: Meta<typeof CountdownTimer> = {
  title: 'Components/CountdownTimer',
  component: CountdownTimer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CountdownTimer>;

export const PlentyOfTime: Story = {
  args: {
    deadline: new Date(Date.now() + 30 * 86_400_000),
    label: 'Next check-in due',
  },
};

export const Approaching: Story = {
  args: {
    deadline: new Date(Date.now() + 2 * 86_400_000),
    label: 'Next check-in due',
  },
};

export const Imminent: Story = {
  args: {
    deadline: new Date(Date.now() + 4 * 3_600_000),
    label: 'Next check-in due',
  },
};

export const Overdue: Story = {
  args: {
    deadline: new Date(Date.now() - 1 * 86_400_000),
    label: 'Next check-in due',
  },
};

export const GracePeriod: Story = {
  args: {
    deadline: new Date(Date.now() + 5 * 86_400_000),
    label: 'Grace period ends',
  },
};

export const WithoutLabel: Story = {
  args: {
    deadline: new Date(Date.now() + 15 * 86_400_000),
  },
};
