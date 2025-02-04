import React, {CSSProperties} from "react";
import {Tag} from "./components/Tag";
import {classSelectors} from "./utils/selectors";

type Tags = string[];

export interface ReactTagInputProps {
  tags: Tags;
  onChange: (tags: Tags) => void;
  placeholder?: string;
  maxTags?: number;
  validator?: (val: string) => boolean;
  editable?: boolean;
  readOnly?: boolean;
  removeOnBackspace?: boolean;
  buttonVariant?: boolean;
  buttonStyle?: CSSProperties;
  removeButtonText?: (() => any) | string;
  addButtonText?: (() => any) | string;
  removePlaceholderOnIndex?: number;
}

interface State {
  input: string;
}

export default class ReactTagInput extends React.Component<ReactTagInputProps, State> {

  state = {input: ""};

  // Ref for input element
  inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({input: e.target.value});
  }

  onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    const {input} = this.state;
    const {validator, removeOnBackspace} = this.props;

    // On enter
    if (e.keyCode === 13) {

      // Prevent form submission if tag input is nested in <form>
      e.preventDefault();

      // If input is blank, do nothing
      if (input === "") {
        return;
      }

      // Check if input is valid
      const valid = validator !== undefined ? validator(input) : true;
      if (!valid) {
        return;
      }

      // Add input to tag list
      this.addTag(input);

    }
    // On backspace or delete
    else if (removeOnBackspace && (e.keyCode === 8 || e.keyCode === 46)) {

      // If currently typing, do nothing
      if (input !== "") {
        return;
      }

      // If input is blank, remove previous tag
      this.removeTag(this.props.tags.length - 1);

    }

  }

  onButtonAdd = () => {
    const {input} = this.state;
    const {validator} = this.props;

    // If input is blank, do nothing
    if (input === "") {
      return;
    }

    // Check if input is valid
    const valid = validator !== undefined ? validator(input) : true;
    if (!valid) {
      return;
    }

    this.addTag(input);

  }

  onButtonDelete = () => {
    const {input} = this.state;
    if (input !== "") {
      return;
    }
    this.removeTag(this.props.tags.length - 1);

  }

  addTag = (value: string) => {
    const tags = [...this.props.tags];
    if (!tags.includes(value)) {
      tags.push(value);
      this.props.onChange(tags);
    }
    this.setState({input: ""});
  }

  removeTag = (i: number) => {
    const tags = [...this.props.tags];
    tags.splice(i, 1);
    this.props.onChange(tags);
  }

  updateTag = (i: number, value: string) => {
    const tags = [...this.props.tags];
    const numOccurencesOfValue = tags.reduce((prev, currentValue, index) => prev + (currentValue === value && index !== i ? 1 : 0), 0);
    if (numOccurencesOfValue > 0) {
      tags.splice(i, 1);
    } else {
      tags[i] = value;
    }
    this.props.onChange(tags);
  }

  render() {

    const {input} = this.state;

    const {tags, placeholder, maxTags, editable, readOnly, validator, removeOnBackspace, buttonVariant, addButtonText, removeButtonText, buttonStyle, removePlaceholderOnIndex} = this.props;

    const maxTagsReached = maxTags !== undefined ? tags.length >= maxTags : false;

    const isEditable = readOnly ? false : (editable || false);

    const showInput = !readOnly && !maxTagsReached;

    // @ts-ignore
    // @ts-ignore
    return (
      <div className={classSelectors.wrapper}>
        {tags.map((tag, i) => (
          <Tag
            key={i}
            value={tag}
            index={i}
            editable={isEditable}
            readOnly={readOnly || false}
            inputRef={this.inputRef}
            update={this.updateTag}
            remove={this.removeTag}
            validator={validator}
            removeOnBackspace={removeOnBackspace}
          />
        ))}
        {showInput &&
        <input
            ref={this.inputRef}
            value={input}
            className={classSelectors.input}
            placeholder={ removePlaceholderOnIndex !== undefined ? tags.length < removePlaceholderOnIndex ? placeholder || "Type and press enter" : "" : placeholder || "Type and press enter"}
            onChange={this.onInputChange}
            onKeyDown={this.onInputKeyDown}
        />
        }

        {buttonVariant &&
        <>
          <button style={buttonStyle} onClick={this.onButtonDelete}>
            { typeof removeButtonText === "string" ? removeButtonText : removeButtonText ? removeButtonText() : "Remove"}
          </button>
          <button style={buttonStyle} onClick={this.onButtonAdd}>
            { typeof addButtonText === "string" ? addButtonText : addButtonText ? addButtonText() : "Add"}
          </button>
        </>
        }
      </div>
    );

  }

}
