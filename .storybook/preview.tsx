import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0d001a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-will-dark text-will-light antialiased p-6">
        <Story />
      </div>
    ),
  ],
};

export default preview;
