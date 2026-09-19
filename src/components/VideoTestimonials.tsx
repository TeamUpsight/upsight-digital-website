import VideoTestimonialCard from './VideoTestimonialCard';
import { testimonials } from '@/lib/testimonials';

export default function VideoTestimonials() {
  return <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {testimonials.map((testimonial) => <VideoTestimonialCard key={testimonial.name} {...testimonial} videoLabel={`${testimonial.name}'s video testimonial`} />)}
  </div>;
}
