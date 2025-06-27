"use client"

import { useBackground } from "@/contexts/BackgroundContext"
import type { BackgroundOption } from "@/contexts/BackgroundContext"

interface BackgroundDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function BackgroundDialog({ isOpen, onClose }: BackgroundDialogProps) {
    const { currentBackground, setBackground, backgrounds } = useBackground()

    if (!isOpen) return null

    const handleBackgroundSelect = (background: BackgroundOption) => {
        setBackground(background)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-high-contrast">Choose Background</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {backgrounds.map((background) => (
                            <div
                                key={background.id}
                                onClick={() => handleBackgroundSelect(background)}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${currentBackground.id === background.id
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        {background.type === "image" && background.path ? (
                                            <img
                                                src={background.path}
                                                alt={background.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                                <span className="text-white text-xs">Animated</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-high-contrast">{background.name}</h3>
                                        <p className="text-sm text-medium-contrast capitalize">{background.type}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 