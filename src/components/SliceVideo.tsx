import VideoTestimonialCard from './VideoTestimonialCard';
const VIDEO_TESTIMONIAL_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269151870/NKnKdFDxhaRVudBQKnGMGB/AlyssaWong-SliceLife_76a30443.mp4";

export default function FlippableVideoCard() {
  return <VideoTestimonialCard className="max-w-sm mx-auto" name="Alyssa Wong" role="Director of Growth Marketing, Slice" portrait="/images/alyssa-wong.webp" quote="“Partnering with Upsight Digital has been transformational for Slice. They quickly identified and addressed critical tracking issues—from fragmented event structures and tracking gaps to compliance risks—streamlining our data infrastructure across web and mobile. We now have significantly cleaner data pipelines, improved cross-platform visibility, and greater confidence in our analytics.”" videoSrc={VIDEO_TESTIMONIAL_URL} videoLabel="Alyssa Wong's video testimonial" />;
}
