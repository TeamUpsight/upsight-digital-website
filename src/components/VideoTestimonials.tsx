import VideoTestimonialCard from './VideoTestimonialCard';
import { testimonials } from '@/lib/testimonials';

export default function VideoTestimonials() {
  return <div className="grid items-start gap-6 max-w-6xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
    {testimonials.map((testimonial) => <VideoTestimonialCard key={testimonial.name} {...testimonial} videoLabel={`${testimonial.name}'s video testimonial`} />)}
  </div>;
}
