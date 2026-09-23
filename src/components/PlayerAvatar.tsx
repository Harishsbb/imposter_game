interface PlayerAvatarProps {
  name: string;
  color?: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  className?: string;
}

export const PlayerAvatar = ({
  name,
  color = '#8b5cf6',
  avatar,
  size = 'md',
  showBadge = false,
  badgeText,
  badgeColor = 'bg-emerald-500',
  className = '',
}: PlayerAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center font-bold shadow-lg transition-transform duration-200 border border-white/20`}
        style={{
          backgroundColor: color,
          boxShadow: `0 8px 18px -4px ${color}66`,
        }}
      >
        {avatar ? (
          <span>{avatar}</span>
        ) : (
          <span className="text-white drop-shadow-md">
            {name ? name.substring(0, 2).toUpperCase() : '?'}
          </span>
        )}
      </div>

      {showBadge && badgeText && (
        <span
          className={`absolute -bottom-1 -right-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-white shadow-md uppercase tracking-wider ${badgeColor}`}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
};
