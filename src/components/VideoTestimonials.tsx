import VideoTestimonialCard from './VideoTestimonialCard';

const ALYSSA_VIDEO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663269151870/NKnKdFDxhaRVudBQKnGMGB/AlyssaWong-SliceLife_76a30443.mp4';
const ASHLEY_VIDEO = '/videos/testimonials/ashley-stanford-testimonial.mp4';
// Alan's supplied source is 123.8 MB. Set this to its reviewed CDN/R2/Stream URL when available.
const ALAN_VIDEO: string | undefined = undefined;

export default function VideoTestimonials() {
  return <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    <VideoTestimonialCard name="Alyssa Wong" role="Director of Growth Marketing at Slice" portrait="/images/alyssa-wong.webp" quote="“Partnering with Upsight Digital has been transformational for Slice. They quickly addressed tracking gaps, streamlined our data infrastructure, and implemented server-side tracking and compliance—giving us cleaner data, better visibility, and confidence in our analytics.”" videoSrc={ALYSSA_VIDEO} videoLabel="Alyssa Wong's video testimonial" caseStudyHref="/case-studies/slice" caseStudyLabel="Read Slice Case Study" />
    <VideoTestimonialCard name="Alan Waggoner" role="Paid Media Manager at Shift" portrait="/images/alan-waggoner.webp" quote="“Upsight Digital is simply amazing. Their team solves tracking and analytics challenges that no one else can. Fast, reliable, and brilliant. Working with them has made me look like a rock star for years.”" videoSrc={ALAN_VIDEO} videoLabel="Alan Waggoner's video testimonial" />
    <VideoTestimonialCard name="Ashley Stanford" role="Head of Marketing at TicketSocket" portrait="/images/ashley-stanford.webp" quote="“Upsight Digital has been an incredible resource for our team. They support our devs with Google Suite, Analytics, and e-commerce tracking—always prompt, thorough, and extremely helpful. We continue to work with them and gladly refer them to others.”" videoSrc={ASHLEY_VIDEO} videoLabel="Ashley Stanford's video testimonial" />
  </div>;
}
