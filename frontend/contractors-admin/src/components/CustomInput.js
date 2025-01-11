import { ErrorMessage, useField } from "formik";
import { useId, useState } from "react";
import Select from "react-select";
import {
  CloseButton,
  FormControl,
  FormLabel,
  Image,
  Ratio,
  Stack,
} from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import MultiSelect from "react-select";

export const MyInput = ({
  label,
  select,
  textarea,
  rules,
  multiData,
  children,
  ...props
}) => {
  const [field, meta] = useField(props);
  // console.log(field.name, "meta.error", meta.error);
  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel
        _dark={{
          color: "gray.300",
        }}
        _light={{
          color: "gray.700",
        }}
      >
        {label}{" "}
        {rules && rules.required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>

      {select ? (
        rules?.multiSelect ? (
          <MultiSelect
            isMulti
            defaultValue={field.value}
            options={multiData}
            placeholder={`Select ${label}`}
            value={field.value}
            closeMenuOnSelect={false}
            {...field}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary75:
                  meta.touched && meta.error
                    ? "var(--chakra-colors-red-400)"
                    : "var(--chakra-colors-primary-400)",
                primary50: "var(--chakra-colors-primary-300)",
                primary25: "var(--chakra-colors-primary-50)",
                primary:
                  meta.touched && meta.error
                    ? "var(--chakra-colors-red-400)"
                    : "var(--chakra-colors-primary-500)",
                neutral20:
                  meta.touched && meta.error
                    ? "var(--chakra-colors-red-400)"
                    : "var(--chakra-colors-gray-500)",
                neutral50: "var(--chakra-colors-colors-500)",
              },
            })}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "transparent",
              }),
            }}
            {...props}
          />
        ) : (
          <Select
            borderColor={"gray.500"}
            borderWidth={1}
            placeholder={`Select ${label}`}
            focusBorderColor={"primary.500"}
            {...field}
            _dark={{
              color: "gray.300",
            }}
            _light={{
              color: "gray.700",
            }}
            {...props}
          >
            {children}
          </Select>
        )
      ) : textarea ? (
        <TextareaAutosize
          {...field}
          variant="outline"
          _dark={{
            color: "gray.300",
            borderColor: "gray.500",
          }}
          _light={{
            color: "gray.700",
            borderColor: "gray.500",
          }}
          borderWidth={1}
          focusBorderColor="primary.500"
          boxShadow="none"
          placeholder={`Enter ${label}`}
          value={field.value || ""}
          {...props}
        />
      ) : (
        <FormControl
          {...field}
          variant="outline"
          _dark={{
            color: "gray.300",
          }}
          _light={{
            color: "gray.700",
          }}
          borderWidth={1}
          boxShadow="none"
          placeholder={`Enter ${label}`}
          value={field.value || ""}
          {...props}
        />
      )}
      {meta.touched && meta.error ? (
        <ErrorMessage>{meta.error}</ErrorMessage>
      ) : null}
    </FormControl>
  );
};

export const MyFileInput = ({ label, rules, innerRef, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const [file, setFile] = useState(null);
  const [dragged, setDragged] = useState(false);
  const id = useId();
  const errorColor = meta.touched && meta.error ? "red.500" : "gray.500";
  const showPreview = rules.preview ? rules.preview : false;
  const multiple = rules.multiple;
  const drop = (event) => {
    event.preventDefault();
    let _file = event.dataTransfer.files;
    if (multiple) {
      setFile(_file);
      helpers.setValue(_file);
    } else {
      setFile(_file[0]);
      helpers.setValue(_file[0]);
    }
    setDragged(true);
  };
  const dragOver = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <div
        as="label"
        htmlFor={id}
        border={3}
        borderRadius="lg"
        borderStyle={meta.touched && meta.error ? "solid" : "dashed"}
        p={50}
        width={"full"}
        textAlign="center"
        _light={{
          bg: dragged ? "primary.800" : "transparent",
          borderColor: errorColor,
        }}
        _dark={{
          borderColor: "gray.700",
        }}
        cursor="pointer"
        display={"block"}
        onDrop={drop}
        onDragOver={dragOver}
      >
        <div
          fontSize="lg"
          fontWeight="bold"
          mb={2}
          _light={{
            color: errorColor,
          }}
          _dark={{
            color: meta.touched && meta.error ? "red.500" : "gray.700",
          }}
        >
          {multiple && file?.length > 0 ? (
            file?.length + " files selected"
          ) : field.value?.name ? (
            <span>
              Selected File <br /> <strong>{field.value.name}</strong>
            </span>
          ) : label ? (
            label + `${rules.required ? " *" : ""}`
          ) : (
            `Drop file here or click to upload ${rules.required ? " *" : ""}`
          )}
        </div>
        <FormControl
          ref={innerRef}
          id={id}
          type="file"
          transform={"scale(0)"}
          visibility={"hidden"}
          position={"absolute"}
          left={"-5000px"}
          multiple={multiple}
          {...props}
          onChange={(e) => {
            let _file = e.target.files;
            if (multiple) {
              setFile(_file);
              helpers.setValue(_file);
            } else {
              setFile(_file[0]);
              helpers.setValue(_file[0]);
            }
            setDragged(true);
            props.onChange && props.onChange(e);
          }}
        />
        {meta.touched && meta.error ? (
          <ErrorMessage color={errorColor}>{meta.error}</ErrorMessage>
        ) : null}
      </div>
      {showPreview && (file || field?.value) && !multiple ? (
        <div
          style={{ width: "200px", height: "200px" }}
          my={2}
          borderRadius="lg"
          position={"relative"}
          _light={{
            bg: "gray.100",
          }}
          _dark={{
            bg: "gray.900",
          }}
        >
          <CloseButton
            bg={"red.500"}
            display={"block"}
            ml={"auto"}
            size={"sm"}
            position={"absolute"}
            top={"0"}
            right={"0"}
            zIndex={"3"}
            onClick={() => {
              setFile(null);
              helpers.setValue(null);
              setDragged(false);
            }}
          />
          {!file && field.value ? (
            <FilePreview img={field.value} />
          ) : (
            <FilePreview file={file} />
          )}
        </div>
      ) : showPreview && multiple && file?.length > 0 ? (
        <Stack gap={2} wrap={"wrap"} justifyContent={"center"}>
          {Array.from(file).map((single, i) => (
            <div
              key={i}
              w={100}
              h={100}
              my={2}
              marginInlineStart={"0!important"}
              borderRadius="lg"
              overflow={"hidden"}
              position={"relative"}
              _light={{
                bg: "gray.100",
              }}
              _dark={{
                bg: "gray.900",
              }}
            >
              <CloseButton
                bg={"red.500"}
                display={"block"}
                ml={"auto"}
                size={"sm"}
                position={"absolute"}
                top={"0"}
                right={"0"}
                zIndex={"3"}
                onClick={() => {
                  const newFile = Array.from(file).filter(
                    (_single, _i) => _i !== i
                  );
                  setFile(newFile);
                  if (newFile.length > 0) {
                    helpers.setValue(newFile);
                  } else {
                    helpers.setValue(null);
                  }
                }}
              />
              <FilePreview file={single} />
            </div>
          ))}
        </Stack>
      ) : (
        field?.value?.length > 0 ||
        (multiple && (
          <Stack gap={2} wrap={"wrap"} justifyContent={"center"}>
            {field.value?.map((img, i) => (
              <div key={i}>
                <FilePreview img={img} />
              </div>
            ))}
          </Stack>
        ))
      )}
    </>
  );
};

const FilePreview = ({ file, img }) => {
  const type = !img
    ? file.name.split(".").pop().toLowerCase()
    : img.split(".").pop().toLowerCase();
  const imageType = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "bmp",
    "tiff",
    "svg",
    "avif",
  ];
  const videoType = ["mp4", "webm", "mov", "wmv", "flv", "avi", "mpg", "mpeg"];
  const docType = [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "pdf",
    "txt",
    "odt",
    "apk",
    "exe",
    "csv",
  ];
  const iframeType = [
    "html",
    "htm",
    "php",
    "asp",
    "aspx",
    "js",
    "scss",
    "css",
    "xml",
    "json",
  ];

  if (imageType.includes(type)) {
    return (
      <Image
        src={!img ? URL.createObjectURL(file) : img}
        alt={!img ? file.name : img}
        style={{ objectFit: "contain" }}
        height={"100%"}
        width={"100%"}
      />
    );
  }
  if (videoType.includes(type)) {
    return (
      <Ratio ratio={16 / 9}>
        <video
          src={!img ? URL.createObjectURL(file) : img}
          alt={!img ? file.name : img}
          h={50}
          w={50}
        />
      </Ratio>
    );
  }
  if (iframeType.includes(type)) {
    return (
      <Ratio ratio={1 / 1}>
        <iframe
          title={!img ? file.name : img}
          src={!img ? URL.createObjectURL(file) : img}
          alt={!img ? file.name : img}
          h={50}
          w={50}
        />
      </Ratio>
    );
  }
  if (docType.includes(type)) {
    return (
      <div textAlign={"center"} fontSize="xs">
        No preview available for this file type.
      </div>
    );
  }
};
