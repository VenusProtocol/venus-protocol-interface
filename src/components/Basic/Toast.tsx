import React from 'react';
import PropTypes from 'prop-types';
import { toast as toastify } from 'react-toastify';

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export function Toast({ title, description, type, ...props }: $TSFixMe) {
  return (
    <div {...props} className={`toast_container_wrapper ${type}`}>
      {title && <p className="title">{title}</p>}
      {description && <p className="description">{description}</p>}
    </div>
  );
}

Toast.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(['success', 'info', 'error'])
};

Toast.defaultProps = {
  title: '',
  description: '',
  type: 'success'
};

function toast(
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  { title, description, type = 'success', ...props }: $TSFixMe,
  options = {}
) {
  return toastify(
    <Toast title={title} description={description} type={type} {...props} />,
    options
  );
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
toast.info = (content: $TSFixMe, options: $TSFixMe) =>
  toast({ ...content, type: 'info' }, options);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
toast.error = (content: $TSFixMe, options: $TSFixMe) =>
  toast({ ...content, type: 'error' }, options);
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
toast.success = (content: $TSFixMe, options: $TSFixMe) =>
  toast({ ...content, type: 'success' }, options);
toast.update = toastify.update;

export default toast;
