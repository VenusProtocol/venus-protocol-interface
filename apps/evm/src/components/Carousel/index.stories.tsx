import type { Meta, StoryObj } from '@storybook/react';

import { Carousel, CarouselItem } from '.';

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  args: {
    children: [
      <CarouselItem key="one">
        <div className="rounded-lg bg-dark-blue p-6 text-center">Slide 1</div>
      </CarouselItem>,
      <CarouselItem key="two">
        <div className="rounded-lg bg-dark-blue p-6 text-center">Slide 2</div>
      </CarouselItem>,
      <CarouselItem key="three">
        <div className="rounded-lg bg-dark-blue p-6 text-center">Slide 3</div>
      </CarouselItem>,
    ],
    className: 'max-w-md',
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
