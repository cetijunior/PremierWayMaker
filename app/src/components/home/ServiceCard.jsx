import Card from '../ui/Card';

export default function ServiceCard({ title, desc, icon }) {
  return (
    <Card>
      {icon && <div className="text-3xl mb-3">{icon}</div>}
      <h3 className="text-[#1B2A4A] font-semibold text-base mb-1">{title}</h3>
      <p className="text-[#5A6A7A] text-sm">{desc}</p>
    </Card>
  );
}
