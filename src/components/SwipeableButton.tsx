// Borrowed from https://raw.githubusercontent.com/abdurrahman720/react-swipeable-button/main/src/components/SwipeableButton.tsx
// because it's more responsive than the crap that Alexey came up with.

import { ChevronRight } from "lucide-react";
import React, { Component, ForwardedRef, RefObject } from "react";

interface SwipeableButtonProps {
  text?: string;
  text_unlocked?: string;
  disabled?: boolean;
  innerRef: ForwardedRef<unknown>;
  onSuccess?: () => void;
  onFailure?: () => void;
}

interface SwipeableButtonState {
  unlocked: boolean;
}

class SwipeableButtonComponent extends Component<
  SwipeableButtonProps,
  SwipeableButtonState
> {
  private sliderLeft: number = 0;
  private isDragging: boolean = false;
  private startX: number = 0;
  private containerWidth: number = 0;

  private sliderRef: RefObject<HTMLDivElement> = React.createRef();
  private containerRef: RefObject<HTMLDivElement> = React.createRef();

  constructor(props: SwipeableButtonProps) {
    super(props);
    this.state = {
      unlocked: false,
    };
  }

  componentDidMount() {
    this.containerRef = this.props.innerRef as any;
    if (this.containerRef.current) {
      this.containerWidth = this.containerRef.current.clientWidth - 80;
    }

    document.addEventListener("mousemove", this.onDrag);
    document.addEventListener("mouseup", this.stopDrag);
    document.addEventListener("touchmove", this.onDrag);
    document.addEventListener("touchend", this.stopDrag);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("touchmove", this.onDrag);
    document.removeEventListener("touchend", this.stopDrag);
  }

  onDrag = (e: MouseEvent | TouchEvent) => {
    if (this.state.unlocked) {
      return;
    }

    if (this.isDragging) {
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      this.sliderLeft = Math.min(
        Math.max(0, clientX - this.startX),
        this.containerWidth,
      );
      this.updateSliderStyle();
    }
  };

  updateSliderStyle = () => {
    if (this.state.unlocked) return;
    if (this.sliderRef.current) {
      this.sliderRef.current.style.width = `${this.sliderLeft + 80}px`;
    }
  };

  stopDrag = () => {
    if (this.state.unlocked) return;
    if (this.isDragging) {
      this.isDragging = false;
      if (this.sliderLeft > this.containerWidth * 0.9) {
        this.sliderRef.current!.style.width = "fit-parent";
        if (this.props.onSuccess) {
          this.props.onSuccess();
          this.onSuccess();
        }
      } else {
        this.sliderLeft = 0;
        if (this.props.onFailure) {
          this.props.onFailure();
        }
        this.updateSliderStyle();
      }
    }
  };

  startDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (this.state.unlocked || this.props.disabled) return;
    this.isDragging = true;
    this.startX = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  onSuccess = () => {
    this.setState({
      unlocked: true,
    });
  };

  getText = () => {
    return this.state.unlocked
      ? this.props.text_unlocked || "UNLOCKED"
      : this.props.text || "SLIDE";
  };

  reset = () => {
    if (this.state.unlocked) return;
    this.setState({ unlocked: false }, () => {
      this.sliderLeft = 0;
      this.updateSliderStyle();
    });
  };

  render() {
    return (
      <div
        ref={this.props.innerRef as any}
        className="w-full relative whitespace-nowrap"
        style={{
          opacity: this.props.disabled ? 0.5 : 1,
          overflow: "hidden",
        }}
      >
        <div
          className="absolute bg-primary h-full rounded-full whitespace-nowrap"
          ref={this.sliderRef}
          onMouseDown={this.startDrag}
          onTouchStart={this.startDrag}
          style={{
            width: 80,
            maxWidth: "100%",
          }}
        >
          <span className="h-full w-full text-primary-foreground block">
            {!this.state.unlocked && (
              <ChevronRight className="h-full w-[80px] float-right p-2" />
            )}
          </span>
        </div>
        <div className="w-full h-14 text-sm font-medium bg-secondary rounded-full text-secondary-foreground flex flex-col justify-center items-center">
          Swipe to send
        </div>
      </div>
    );
  }
}

export const SwipeableButton = React.forwardRef((props: any, ref) => (
  <SwipeableButtonComponent {...props} innerRef={ref} />
));
