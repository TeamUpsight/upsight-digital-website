import VideoTestimonialCard from './VideoTestimonialCard';
const VIDEO_TESTIMONIAL_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269151870/NKnKdFDxhaRVudBQKnGMGB/AlyssaWong-SliceLife_76a30443.mp4";

export default function FlippableVideoCard() {
  return <VideoTestimonialCard className="max-w-sm mx-auto" name="Alyssa Wong" role="Director of Growth Marketing, Slice" portrait="/images/alyssa-wong.webp" quote="“Partnering with Upsight has been transformational for Slice. They quickly identified tracking gaps, streamlined our data infrastructure, and implemented server-side tracking and compliance, giving us cleaner data, better visibility, and confidence in our analytics.”" videoSrc={VIDEO_TESTIMONIAL_URL} posterSrc="/images/testimonials/alyssa-wong-testimonial-poster.png" videoLabel="Alyssa Wong's video testimonial" />;
}
