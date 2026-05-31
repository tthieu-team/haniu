import Icon from '@/components/common/Icons';

interface TimelineStep {
  level: number;
  label: string;
  icon: string;
}

interface OrderTimelineProps {
  orderStep: number;
}

const timelineSteps: TimelineStep[] = [
  { level: 1, label: 'Chờ xử lý', icon: 'hourglass' },
  { level: 2, label: 'Xác nhận', icon: 'check' },
  { level: 3, label: 'Đang giao', icon: 'truck' },
  { level: 4, label: 'Đã nhận', icon: 'shield' }
];

export default function OrderTimeline({ orderStep }: OrderTimelineProps) {
  return (
    <div className="py-4">
      <div className="flex justify-between items-center max-w-md mx-auto relative">
        {/* Connector Line */}
        <div className="absolute left-[8%] right-[8%] top-[14px] h-0.5 bg-slate-100 dark:bg-zinc-800 -z-10">
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${((orderStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {timelineSteps.map((step) => {
          const isActive = orderStep >= step.level;
          const isCurrent = orderStep === step.level;

          return (
            <div key={step.level} className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border text-[10px] transition-all duration-300 ${
                  isCurrent
                    ? 'bg-rose-500 text-white border-rose-500 ring-4 ring-rose-500/20'
                    : isActive
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 dark:bg-rose-950/20'
                    : 'bg-white dark:bg-zinc-900 text-slate-350 dark:text-zinc-650 border-slate-200 dark:border-zinc-800'
                }`}
              >
                <Icon name={step.icon} size={11} />
              </div>
              <span
                className={`text-[9px] font-bold tracking-wide transition-colors ${
                  isActive ? 'text-slate-800 dark:text-zinc-200' : 'text-slate-400 dark:text-zinc-550'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
