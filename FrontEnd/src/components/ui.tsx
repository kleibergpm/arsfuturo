import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, X, XCircle } from "lucide-react";
import type {
	ButtonHTMLAttributes,
	InputHTMLAttributes,
	ReactNode,
	SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

export const cls = (...values: Array<string | false | null | undefined>) =>
	values.filter(Boolean).join(" ");

type CardProps = { className?: string; children: ReactNode };
export const Card = ({ className = "", children }: CardProps) => (
	<section className={cls("app-surface rounded-[1.35rem] p-5", className)}>
		{children}
	</section>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "ghost" | "success" | "danger" | "warning";
	size?: "sm" | "md" | "lg";
};
export const Button = ({
	children,
	onClick,
	variant = "primary",
	size = "md",
	className = "",
	disabled = false,
	type = "button",
	...rest
}: ButtonProps) => {
	const variants = {
		primary:
			"bg-[#176b70] hover:bg-[#12585c] text-white shadow-[0_8px_18px_rgba(23,107,112,0.2)]",
		ghost: "bg-white/60 hover:bg-white text-[#24424d] border border-[#cbd8d5]",
		success: "bg-[#23856f] hover:bg-[#1b6e5d] text-white",
		danger: "bg-[#c95c4e] hover:bg-[#ad493d] text-white",
		warning: "bg-[#c47b2b] hover:bg-[#a96622] text-white",
	};
	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2.5",
		lg: "px-5 py-3 text-lg",
	};
	return (
		<button
			{...rest}
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={cls(
				"rounded-xl font-semibold transition-all duration-200 cursor-pointer active:translate-y-px",
				variants[variant],
				sizes[size],
				disabled && "opacity-60 cursor-not-allowed",
				className,
			)}
		>
			{children}
		</button>
	);
};

type Notification = {
	id: number;
	message: string;
	type?: string;
	title?: string;
};
export function NotificationContainer({
	notifications,
	onRemove,
}: {
	notifications: Notification[];
	onRemove: (id: number) => void;
}) {
	return (
		<div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
			<AnimatePresence>
				{notifications.map((notification) => (
					<NotificationCard
						key={notification.id}
						notification={notification}
						onRemove={onRemove}
					/>
				))}
			</AnimatePresence>
		</div>
	);
}
function NotificationCard({
	notification,
	onRemove,
}: {
	notification: Notification;
	onRemove: (id: number) => void;
}) {
	const { id, message, type, title } = notification;
	const icon =
		type === "success" ? (
			<CheckCircle2 className="w-5 h-5 text-green-600" />
		) : type === "error" ? (
			<XCircle className="w-5 h-5 text-red-600" />
		) : (
			<Bell className="w-5 h-5 text-blue-600" />
		);
	const background =
		type === "success"
			? "bg-green-50 border-green-200"
			: type === "error"
				? "bg-red-50 border-red-200"
				: "bg-blue-50 border-blue-200";
	return (
		<motion.div
			initial={{ opacity: 0, x: 24 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 24 }}
			transition={{ duration: 0.22, ease: "easeOut" }}
			className={`${background} border rounded-2xl p-4 shadow-lg backdrop-blur-sm`}
		>
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 mt-0.5">{icon}</div>
				<div className="flex-1 min-w-0">
					{title && (
						<p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
					)}
					<p className="text-sm text-slate-700 leading-relaxed">{message}</p>
				</div>
				<button
					type="button"
					aria-label="Cerrar notificación"
					onClick={() => onRemove(id)}
					className="flex-shrink-0 ml-2 text-slate-400 hover:text-slate-600 transition-colors"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		</motion.div>
	);
}

export const Badge = ({
	children,
	color = "slate",
	className = "",
}: {
	children: ReactNode;
	color?: "green" | "red" | "amber" | "blue" | "slate";
	className?: string;
}) => (
	<span
		className={cls(
			"px-2 py-0.5 rounded-full text-xs font-medium border",
			color === "green" && "bg-emerald-50 text-emerald-700 border-emerald-200",
			color === "red" && "bg-rose-50 text-rose-700 border-rose-200",
			color === "amber" && "bg-amber-50 text-amber-700 border-amber-200",
			color === "blue" && "bg-sky-50 text-sky-700 border-sky-200",
			color === "slate" && "bg-slate-50 text-slate-700 border-slate-200",
			className,
		)}
	>
		{children}
	</span>
);

type ValueInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"onChange"
> & { onChange?: (value: string) => void };
export const Input = ({
	value,
	onChange,
	placeholder = "",
	type = "text",
	className = "",
	...rest
}: ValueInputProps) => (
	<input
		{...rest}
		type={type}
		value={value}
		onChange={(event) => onChange?.(event.target.value)}
		placeholder={placeholder}
		className={cls(
			"w-full rounded-xl border border-[#cbd8d5] bg-white/70 px-3 py-2.5 text-[#24424d] placeholder:text-[#7d9394] outline-none transition focus:border-[#269e9a] focus:ring-2 focus:ring-[#269e9a]/20",
			className,
		)}
	/>
);
type ValueSelectProps = Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	"onChange"
> & { onChange?: (value: string) => void };
export const Select = ({
	value,
	onChange,
	children,
	className = "",
	...rest
}: ValueSelectProps) => (
	<select
		{...rest}
		value={value}
		onChange={(event) => onChange?.(event.target.value)}
		className={cls(
			"w-full rounded-xl border border-[#cbd8d5] bg-white/70 px-3 py-2.5 text-[#24424d] outline-none transition focus:border-[#269e9a] focus:ring-2 focus:ring-[#269e9a]/20",
			className,
		)}
	>
		{children}
	</select>
);
export const Divider = ({ className = "" }: { className?: string }) => (
	<div className={cls("h-px w-full bg-[#d7e1de]", className)} />
);

export const Modal = ({
	open,
	onClose,
	title,
	children,
	footer = null,
}: {
	open: boolean;
	onClose: () => void;
	title: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
}) =>
	createPortal(
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<button
						type="button"
						aria-label="Cerrar ventana"
						className="absolute inset-0 h-full w-full cursor-pointer bg-slate-900/40 backdrop-blur-[1px]"
						onClick={onClose}
					/>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[1.35rem] bg-[#fffdf9] p-3 sm:p-5 shadow-2xl"
					>
						<div className="flex items-center justify-between gap-2 sm:gap-4">
							<h3 className="text-base sm:text-lg font-semibold truncate">
								{title}
							</h3>
							<button
								type="button"
								aria-label="Cerrar ventana"
								className="p-1 sm:p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
								onClick={onClose}
							>
								<XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
							</button>
						</div>
						<div className="mt-3">{children}</div>
						{footer && (
							<div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
								{footer}
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
