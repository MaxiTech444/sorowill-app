import type { Meta, StoryObj } from '@storybook/react';
import { WillStatus } from '@sorowill/sdk';
import { StatusBanner } from './StatusBanner';

const meta: Meta<typeof StatusBanner> = {
  title: 'Components/StatusBanner',
  component: StatusBanner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusBanner>;

export const Active: Story = {
  args: { status: WillStatus.Active },
};

export const Triggered: Story = {
  args: { status: WillStatus.Triggered },
};

export const Released: Story = {
  args: { status: WillStatus.Released },
};

export const Cancelled: Story = {
  args: { status: WillStatus.Cancelled },
};

export const ActiveCompact: Story = {
  args: { status: WillStatus.Active, compact: true },
};

export const TriggeredCompact: Story = {
  args: { status: WillStatus.Triggered, compact: true },
};

export const CancelledCompact: Story = {
  args: { status: WillStatus.Cancelled, compact: true },
};
